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

import { config } from './config';
import { MILLISECONDS_PER_SECOND } from './constants';
import { GeneticAlgorithmOrchestrator } from './genetic';
import { Genome } from './genome';
import { Logger, MessageLogger } from './logging';
import { MessageType, publishMessage } from './message';
import { Scene } from './scene';
import { SimulatorResult, Simulator } from './simulator';

export class CrittersWorker {
    constructor(
        private readonly geneticAlgorithmOrchestrator: GeneticAlgorithmOrchestrator,
        private readonly logger: Logger,
    ) {}

    start(): void {
        this.logger.log('Worker is alive!');

        this.geneticAlgorithmOrchestrator.start();

        this.loop();

        this.logger.log('Worker is done!');
    }

    private loop(): void {
        let updateDue = performance.now() + config.worker.firstUpdate * MILLISECONDS_PER_SECOND;

        for (let generation = 1; generation <= config.worker.generations; ++generation) {
            const timeStart = performance.now();

            const simResults = this.geneticAlgorithmOrchestrator.run();

            const timeEnd = performance.now();

            if (timeEnd > updateDue || generation == config.worker.generations) {
                this.updateMain(simResults);
                updateDue = timeEnd + config.worker.updateInterval * MILLISECONDS_PER_SECOND;
            }

            if (generation % config.worker.logInterval == 0) {
                this.logGeneration(simResults, generation, timeEnd - timeStart);
            }
        }
    }

    private updateMain(simResults: SimulatorResult[]): void {
        const genomes: Genome[] = [];

        for (let idx = 0; idx < config.critter.howMany; ++idx) {
            genomes.push(simResults[idx].genome);
        }

        this.logger.log(
            `Sending update. Fitness: ${this.formatFitnessScore(this.computeFitnessScore(simResults))}`,
        );

        publishMessage({
            type: MessageType.updateGenome,
            genomes: genomes.map((genome) => genome.serialize()),
        });
    }

    private logGeneration(
        simResults: readonly SimulatorResult[],
        generation: number,
        durationInMs: number,
    ): void {
        this.logger.log(
            'Generation: ' +
                generation.toString() +
                ' Duration (ms): ' +
                Math.floor(durationInMs).toString() +
                ' Fitness: ' +
                this.formatFitnessScore(this.computeFitnessScore(simResults)),
        );
    }

    private computeFitnessScore(simResult: readonly SimulatorResult[]): number {
        let sum = 0.0;

        for (let idx = 0; idx < config.geneticAlgorithm.keepBest; ++idx) {
            sum += simResult[idx].fitness;
        }

        return sum / config.geneticAlgorithm.keepBest;
    }

    private formatFitnessScore(fitnessScore: number): string {
        return fitnessScore.toFixed(3);
    }
}

export function startWorker(): void {
    const worker = new CrittersWorker(
        new GeneticAlgorithmOrchestrator(new Simulator(new Scene(false))),
        new MessageLogger(),
    );
    worker.start();
}

startWorker();
