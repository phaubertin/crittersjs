/* Copyright (C) 2019 Philippe Aubertin.
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

import { BEST_KEEP, BEST_PRIORITY, DANGER_COST, FIRST_UPDATE, FOOD_COST, LOG_INTERVAL, NUM_CRITTERS, POPULATION_SIZE, RAND_KEEP, RAND_NEW, SCENE_HEIGHT, SCENE_WIDTH, SIM_TIME, TIME_STEP, UPDATE_INTERVAL, WORST_DISCARD } from './config';
import { createCritter } from './critter';
import { makeBaby, randomGenome } from './genome';
import { createMessage, messageType } from './message';
import { createScene } from './scene';
 
const SIM_STEPS = SIM_TIME * 1000 / TIME_STEP

const MILLISECONDS_PER_SECOND = 1000
 
startWorker();

function logStatus(status) {
    self.postMessage(
        createMessage(messageType.LOG_STATUS, status));
}

function startWorker() {
    logStatus("Worker is alive!");
    
    let population = randomPopulation(POPULATION_SIZE);
    let updateDue = performance.now() + FIRST_UPDATE * MILLISECONDS_PER_SECOND;
    let generation = 1;
    
    while(true) {
        let timeStart = performance.now();
        let simResult = runSimulation(population);
        
        sortResult(simResult);
        
        let fitnessScore = averageFitnessNFirst(simResult, BEST_KEEP);
        let pool = selectPool(simResult);
        
        population = generateNextPopulation(pool, POPULATION_SIZE);
        
        let timeEnd = performance.now();
            
        if(timeEnd > updateDue) {
            doUpdate(simResult, fitnessScore);
            updateDue = timeEnd + UPDATE_INTERVAL * MILLISECONDS_PER_SECOND;
        }
        
        if(generation % LOG_INTERVAL == 0) {
            logGeneration(generation, fitnessScore, timeEnd - timeStart);
        }
        
        ++generation;
    }
}

function averageFitnessNFirst(simResult, n) {
    let sum = 0.0;
    
    for(let idx = 0; idx < n; ++idx) {
        sum += simResult[idx].fitness;
    }
    
    return sum / n;
}

function doUpdate(simResult, fitnessScore) {
    let genomes = [] as any[];

    for(let idx = 0; idx < NUM_CRITTERS; ++idx) {
        genomes.push(simResult[idx].genome);
    }
    
    logStatus("Sending update. Fitness: " + fitnessScore.toFixed(3));
    
    self.postMessage(
        createMessage(messageType.GENOME_UPDATE, genomes));
}

function logGeneration(generation, fitnessScore, duration) {
    logStatus(
        "Generation: "     + generation.toString() +
        " Duration (ms): " + Math.floor(duration).toString() +
        " Fitness: "       + fitnessScore.toFixed(3));
}

function sortResult(simResult) {
    simResult.sort(function(a, b){
        return b.fitness - a.fitness;
    });
}

function selectPool(simResult) {
    let pool = [] as any[];
    
    for(let n = 0; n < WORST_DISCARD; ++n) {
        simResult.pop();
    }
    
    for(let idx = 0; idx < BEST_KEEP; ++idx) {
        for(let n = 0; n < BEST_PRIORITY; ++n) {
            pool.push(simResult[idx].genome);
        }
    }
    
    for(let n = 0; n < RAND_KEEP; ++n) {
        let keepIndex = Math.floor(Math.random() * simResult.length);
        pool.push(simResult[keepIndex].genome);
    }
    
    for(let n = 0; n < RAND_NEW; ++n) {
        pool.push(randomGenome());
    }
    
    return pool
}

function generateNextPopulation(pool, size) {
    let population = [] as any[];
        
    for(let n = 0; n < size; ++n) {
        let mommyIndex = Math.floor(Math.random() * pool.length);
        let daddyIndex = Math.floor(Math.random() * pool.length);
        
        population.push(makeBaby(pool[mommyIndex], pool[daddyIndex]));
    }
    
    return population;
}

function randomPopulation(size) {
    let population = [] as any[];
    
    for(let idx = 0; idx < size; ++idx) {
        population.push(randomGenome());
    }
    
    return population;
}

function computeFitness(critter) {
    return FOOD_COST * critter.foodCount + DANGER_COST * critter.dangerCount;
}

function runSimulation(population) {
    let scene = createScene(SCENE_WIDTH, SCENE_HEIGHT, false);
    let result = [] as any[];
    
    /* Until all genomes in the population have been processed ... */
    for(let popIndex = 0; popIndex < population.length; /* nothing */) {
        /* ... add at most NUM_CRITTERS genomes from the remaining ones to the scene. */
        for(let idx = 0; idx < NUM_CRITTERS && popIndex < population.length; ++idx, ++popIndex) {
            scene.addCritter(
                createCritter(SCENE_WIDTH, SCENE_HEIGHT, population[popIndex]));
        }
        
        /* simulate scene */
        for(let step = 0; step < SIM_STEPS; ++step) {
            scene.updatePosition(TIME_STEP / MILLISECONDS_PER_SECOND);
        }
        
        /* harvest time */
        let critter = scene.harvestCritter();
        
        while(critter != null) {
            result.push({
                fitness : computeFitness(critter),
                genome : critter.genome
            });
            
            critter = scene.harvestCritter();
        }
    }
    
    return result;
}
