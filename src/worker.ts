/* Copyright (C) 2019-2025 Philippe Aubertin.
 * All rights reserved.

 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the author nor the names of other contributors
 *    may be used to endorse or promote products derived from this software
 *    without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import {
    BEST_KEEP,
    BEST_PRIORITY,
    FIRST_UPDATE,
    LOG_INTERVAL,
    NUM_CRITTERS,
    POPULATION_SIZE,
    RAND_KEEP,
    RAND_NEW,
    SCENE_HEIGHT,
    SCENE_WIDTH,
    SIM_TIME,
    TIME_STEP,
    UPDATE_INTERVAL,
    WORST_DISCARD,
} from './config';
import { MILLISECONDS_PER_SECOND } from './constants';
import { Critter } from './critter';
import { Genome, makeBaby, randomGenome, randomPopulation } from './genome';
import { Logger, MessageLogger } from './logging';
import { MessageType, publishMessage } from './message';
import { Scene } from './scene';

interface SimulationResult {
    fitness: number;
    genome: Genome;
}

const SIM_STEPS = (SIM_TIME * 1000) / TIME_STEP;

const logger: Logger = new MessageLogger();

startWorker();

function startWorker(): void {
    logger.log('Worker is alive!');

    let population = randomPopulation(POPULATION_SIZE);
    let updateDue = performance.now() + FIRST_UPDATE * MILLISECONDS_PER_SECOND;
    let generation = 1;

    while (true) {
        let timeStart = performance.now();
        let simResult = runSimulation(population);

        sortSimulationResults(simResult);

        let fitnessScore = averageFitnessNFirst(simResult, BEST_KEEP);
        let pool = selectPool(simResult);

        population = generateNextPopulation(pool, POPULATION_SIZE);

        let timeEnd = performance.now();

        if (timeEnd > updateDue) {
            doUpdate(simResult, fitnessScore);
            updateDue = timeEnd + UPDATE_INTERVAL * MILLISECONDS_PER_SECOND;
        }

        if (generation % LOG_INTERVAL == 0) {
            logGeneration(generation, fitnessScore, timeEnd - timeStart);
        }

        ++generation;
    }
}

function averageFitnessNFirst(simResult: SimulationResult[], n: number): number {
    let sum = 0.0;

    for (let idx = 0; idx < n; ++idx) {
        sum += simResult[idx].fitness;
    }

    return sum / n;
}

function doUpdate(simResults: SimulationResult[], fitnessScore: number): void {
    let genomes: Genome[] = [];

    for (let idx = 0; idx < NUM_CRITTERS; ++idx) {
        genomes.push(simResults[idx].genome);
    }

    logger.log('Sending update. Fitness: ' + fitnessScore.toFixed(3));

    publishMessage({
        type: MessageType.updateGenome,
        genomes,
    });
}

function logGeneration(generation: number, fitnessScore: number, durationInMs: number): void {
    logger.log(
        'Generation: ' +
            generation.toString() +
            ' Duration (ms): ' +
            Math.floor(durationInMs).toString() +
            ' Fitness: ' +
            fitnessScore.toFixed(3),
    );
}

function sortSimulationResults(simResult: SimulationResult[]): void {
    simResult.sort(function (a, b) {
        return b.fitness - a.fitness;
    });
}

function selectPool(simResults: SimulationResult[]): Genome[] {
    let pool: Genome[] = [];

    for (let n = 0; n < WORST_DISCARD; ++n) {
        simResults.pop();
    }

    for (let idx = 0; idx < BEST_KEEP; ++idx) {
        for (let n = 0; n < BEST_PRIORITY; ++n) {
            pool.push(simResults[idx].genome);
        }
    }

    for (let n = 0; n < RAND_KEEP; ++n) {
        const keepIndex = Math.floor(Math.random() * simResults.length);
        pool.push(simResults[keepIndex].genome);
    }

    for (let n = 0; n < RAND_NEW; ++n) {
        pool.push(randomGenome());
    }

    return pool;
}

function generateNextPopulation(pool: Genome[], size: number): Genome[] {
    let population: Genome[] = [];

    for (let n = 0; n < size; ++n) {
        const mommyIndex = Math.floor(Math.random() * pool.length);
        const daddyIndex = Math.floor(Math.random() * pool.length);

        population.push(makeBaby(pool[mommyIndex], pool[daddyIndex]));
    }

    return population;
}

function runSimulation(population: Genome[]): SimulationResult[] {
    let scene = new Scene(false);
    let result: SimulationResult[] = [];

    for (let idx = 0; idx < population.length; idx += NUM_CRITTERS) {
        const subPopulation = population.slice(idx, idx + NUM_CRITTERS);

        subPopulation.forEach((genome) =>
            scene.addCritter(new Critter(genome, SCENE_WIDTH, SCENE_HEIGHT)),
        );

        /* simulate scene */
        for (let step = 0; step < SIM_STEPS; ++step) {
            scene.updatePosition(TIME_STEP / MILLISECONDS_PER_SECOND);
        }

        /* harvest time */
        while (true) {
            const critter = scene.harvestCritter();

            if (!critter) {
                break;
            }

            result.push({
                fitness: critter.computeFitness(),
                genome: critter.getGenome(),
            });
        }
    }

    return result;
}
