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
    POPULATION_SIZE,
    RAND_KEEP,
    RAND_NEW,
    WORST_DISCARD,
} from './config';
import { Genome } from './genome';
import { Simulator, SimulatorResult } from './simulator';

export class GeneticAlgorithmOrchestrator {
    private population: Genome[];
    private generation: number;

    constructor(private readonly simulator: Simulator) {
        this.population = [];
        this.generation = 0;
    }

    getGeneration(): number {
        return this.generation;
    }

    start(): void {
        this.population = Genome.randomPopulation(POPULATION_SIZE);
        this.generation = 0;
    }

    run(): SimulatorResult[] {
        if (this.population.length == 0) {
            this.start();
        }

        const simResults = this.simulator.run(this.population);

        const pool = this.selectPool(simResults);

        this.population = this.generateNextPopulation(pool);

        ++this.generation;

        return simResults;
    }

    private selectPool(simResults: SimulatorResult[]): Genome[] {
        const pool: Genome[] = [];

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
            pool.push(Genome.random());
        }

        return pool;
    }

    private generateNextPopulation(pool: Genome[]): Genome[] {
        const population: Genome[] = [];

        for (let n = 0; n < POPULATION_SIZE; ++n) {
            const mommyIndex = Math.floor(Math.random() * pool.length);
            const daddyIndex = Math.floor(Math.random() * pool.length);

            population.push(pool[mommyIndex].reproduce(pool[daddyIndex]));
        }

        return population;
    }
}
