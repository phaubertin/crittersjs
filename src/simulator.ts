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

import { NUM_CRITTERS, SCENE_HEIGHT, SCENE_WIDTH, SIM_TIME, TIME_STEP } from './config';
import { MILLISECONDS_PER_SECOND } from './constants';
import { Critter } from './critter';
import { Genome } from './genome';
import { Scene } from './scene';

const SIM_STEPS = (SIM_TIME * 1000) / TIME_STEP;

export interface SimulatorResult {
    fitness: number;
    genome: Genome;
}

export class Simulator {
    constructor(private readonly scene: Scene) {}

    run(population: readonly Genome[]): SimulatorResult[] {
        const result: SimulatorResult[] = [];

        for (let idx = 0; idx < population.length; idx += NUM_CRITTERS) {
            const subPopulation = population.slice(idx, idx + NUM_CRITTERS);

            subPopulation.forEach((genome) =>
                this.scene.addCritter(new Critter(genome, SCENE_WIDTH, SCENE_HEIGHT)),
            );

            /* simulate scene */
            for (let step = 0; step < SIM_STEPS; ++step) {
                this.scene.updatePosition(TIME_STEP / MILLISECONDS_PER_SECOND);
            }

            /* harvest time */
            while (true) {
                const critter = this.scene.harvestCritter();

                if (!critter) {
                    break;
                }

                result.push({
                    fitness: critter.computeFitness(),
                    genome: critter.getGenome(),
                });
            }
        }

        return result.sort((a, b) => b.fitness - a.fitness);
    }
}
