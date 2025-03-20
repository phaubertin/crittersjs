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

import { BRAIN_NUM_INPUTS, BRAIN_NUM_OUTPUTS } from './brain';
import { Color } from './color';
import { config } from './config';

export interface GenomeParams {
    color: string;
    hiddenWeights: number[][];
    outputWeights: number[][];
}

export class Genome {
    public color: string;
    public hiddenWeights: number[][];
    public outputWeights: number[][];

    constructor(params: GenomeParams) {
        this.color = params.color;
        this.hiddenWeights = params.hiddenWeights;
        this.outputWeights = params.outputWeights;
    }

    static random(): Genome {
        return new Genome({
            color: Color.random(50, 250),
            hiddenWeights: this.randomWeightMatrix(
                config.neuralNetwork.howManyHidden,
                BRAIN_NUM_INPUTS + 1,
            ),
            outputWeights: this.randomWeightMatrix(
                BRAIN_NUM_OUTPUTS,
                config.neuralNetwork.howManyHidden + 1,
            ),
        });
    }

    private static randomWeightMatrix(rows: number, cols: number): number[][] {
        var matrix = new Array(rows);

        for (var rowIndex = 0; rowIndex < matrix.length; ++rowIndex) {
            var row = new Array(cols);

            for (var idx = 0; idx < row.length; ++idx) {
                row[idx] = this.randomWeight();
            }

            matrix[rowIndex] = row;
        }

        return matrix;
    }

    static randomWeight(): number {
        return 2.0 * config.neuralNetwork.weightAmplitude * (Math.random() - 0.5);
    }

    static randomPopulation(size: number): Genome[] {
        let population: Genome[] = [];

        for (let idx = 0; idx < size; ++idx) {
            population.push(this.random());
        }

        return population;
    }

    reproduce(partner: Genome): Genome {
        const hiddenWeights = new Array(this.hiddenWeights.length);
        const outputWeights = new Array(this.outputWeights.length);

        /* Hidden weights */
        for (let rowIndex = 0; rowIndex < hiddenWeights.length; rowIndex += 4) {
            const rowLength = this.hiddenWeights[0].length;

            hiddenWeights[rowIndex + 0] = new Array(rowLength);
            hiddenWeights[rowIndex + 1] = new Array(rowLength);
            hiddenWeights[rowIndex + 2] = new Array(rowLength);
            hiddenWeights[rowIndex + 3] = new Array(rowLength);

            for (let idx = 0; idx < rowLength; ++idx) {
                if (Math.random() < 0.5) {
                    hiddenWeights[rowIndex + 0][idx] = this.hiddenWeights[rowIndex + 0][idx];
                    hiddenWeights[rowIndex + 1][idx] = this.hiddenWeights[rowIndex + 1][idx];
                    hiddenWeights[rowIndex + 2][idx] = this.hiddenWeights[rowIndex + 2][idx];
                    hiddenWeights[rowIndex + 3][idx] = this.hiddenWeights[rowIndex + 3][idx];
                } else {
                    hiddenWeights[rowIndex + 0][idx] = partner.hiddenWeights[rowIndex + 0][idx];
                    hiddenWeights[rowIndex + 1][idx] = partner.hiddenWeights[rowIndex + 1][idx];
                    hiddenWeights[rowIndex + 2][idx] = partner.hiddenWeights[rowIndex + 2][idx];
                    hiddenWeights[rowIndex + 3][idx] = partner.hiddenWeights[rowIndex + 3][idx];
                }
            }
        }

        /* Output weight */
        let outputRowLength = this.outputWeights[0].length;

        for (let rowIndex = 0; rowIndex < outputWeights.length; ++rowIndex) {
            outputWeights[rowIndex] = new Array(outputRowLength);
        }

        for (let idx = 0; idx < outputRowLength; ++idx) {
            if (Math.random() < 0.5) {
                for (let rowIndex = 0; rowIndex < outputWeights.length; ++rowIndex) {
                    outputWeights[rowIndex][idx] = this.outputWeights[rowIndex][idx];
                }
            } else {
                for (let rowIndex = 0; rowIndex < outputWeights.length; ++rowIndex) {
                    outputWeights[rowIndex][idx] = partner.outputWeights[rowIndex][idx];
                }
            }
        }

        /* Mutation */
        for (let step = 0; step < 10; ++step) {
            let r = Math.random();

            if (r >= 0.5) {
                break;
            }

            /* We know r < 1/2 so this probability is 1/32. */
            if (r < 1.0 / 64) {
                let rowIndex = Math.floor(Math.random() * hiddenWeights.length);
                let idx = Math.floor(Math.random() * hiddenWeights[0].length);
                hiddenWeights[rowIndex][idx] = Genome.randomWeight();
            } else {
                let rowIndex = Math.floor(Math.random() * outputWeights.length);
                let idx = Math.floor(Math.random() * outputWeights[0].length);
                outputWeights[rowIndex][idx] = Genome.randomWeight();
            }
        }

        /* Color */
        let color: string;

        if (Math.random() < 0.5) {
            color = this.color;
        } else {
            color = partner.color;
        }

        return new Genome({
            color: color,
            hiddenWeights: hiddenWeights,
            outputWeights: outputWeights,
        });
    }

    getColor(): string {
        return this.color;
    }

    getHiddenWeights(): readonly number[][] {
        return this.hiddenWeights;
    }

    getOutputWeights(): readonly number[][] {
        return this.outputWeights;
    }

    serialize(): GenomeParams {
        return {
            color: this.color,
            hiddenWeights: this.hiddenWeights,
            outputWeights: this.outputWeights,
        };
    }

    static deSerialize(params: GenomeParams): Genome {
        return new Genome(params);
    }
}
