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

import { BRAIN_NUM_INPUTS, BRAIN_NUM_OUTPUTS } from "./brain";
import { GENOME_HIDDEN_RELU, GENOME_WEIGHT_AMPLITUDE } from "./config";

function randomWeight() {
    return 2.0 * GENOME_WEIGHT_AMPLITUDE * (Math.random() - 0.5);
}

function randomColor() {
    return (
        "rgb(" +
        Math.floor(50 + 200 * Math.random()).toString() +
        ", " +
        Math.floor(50 + 200 * Math.random()).toString() +
        ", " +
        Math.floor(50 + 200 * Math.random()).toString() +
        ")"
    );
}

function randomWeightMatrix(rows, cols) {
    var matrix = new Array(rows);

    for (var rowIndex = 0; rowIndex < matrix.length; ++rowIndex) {
        var row = new Array(cols);

        for (var idx = 0; idx < row.length; ++idx) {
            row[idx] = randomWeight();
        }

        matrix[rowIndex] = row;
    }

    return matrix;
}

export function randomGenome() {
    return {
        color: randomColor(),

        hiddenWeights: randomWeightMatrix(GENOME_HIDDEN_RELU, BRAIN_NUM_INPUTS + 1),

        outputWeights: randomWeightMatrix(BRAIN_NUM_OUTPUTS, GENOME_HIDDEN_RELU + 1),
    };
}

export function makeBaby(mommy, daddy) {
    let hiddenWeights = new Array(mommy.hiddenWeights.length);
    let outputWeights = new Array(mommy.outputWeights.length);

    /* Hidden weights */
    for (let rowIndex = 0; rowIndex < hiddenWeights.length; rowIndex += 4) {
        let rowLength = mommy.hiddenWeights[0].length;

        hiddenWeights[rowIndex + 0] = new Array(rowLength);
        hiddenWeights[rowIndex + 1] = new Array(rowLength);
        hiddenWeights[rowIndex + 2] = new Array(rowLength);
        hiddenWeights[rowIndex + 3] = new Array(rowLength);

        for (let idx = 0; idx < rowLength; ++idx) {
            if (Math.random() < 0.5) {
                hiddenWeights[rowIndex + 0][idx] = mommy.hiddenWeights[rowIndex + 0][idx];
                hiddenWeights[rowIndex + 1][idx] = mommy.hiddenWeights[rowIndex + 1][idx];
                hiddenWeights[rowIndex + 2][idx] = mommy.hiddenWeights[rowIndex + 2][idx];
                hiddenWeights[rowIndex + 3][idx] = mommy.hiddenWeights[rowIndex + 3][idx];
            } else {
                hiddenWeights[rowIndex + 0][idx] = daddy.hiddenWeights[rowIndex + 0][idx];
                hiddenWeights[rowIndex + 1][idx] = daddy.hiddenWeights[rowIndex + 1][idx];
                hiddenWeights[rowIndex + 2][idx] = daddy.hiddenWeights[rowIndex + 2][idx];
                hiddenWeights[rowIndex + 3][idx] = daddy.hiddenWeights[rowIndex + 3][idx];
            }
        }
    }

    /* Output weight */
    let outputRowLength = mommy.outputWeights[0].length;

    for (let rowIndex = 0; rowIndex < outputWeights.length; ++rowIndex) {
        outputWeights[rowIndex] = new Array(outputRowLength);
    }

    for (let idx = 0; idx < outputRowLength; ++idx) {
        if (Math.random() < 0.5) {
            for (let rowIndex = 0; rowIndex < outputWeights.length; ++rowIndex) {
                outputWeights[rowIndex][idx] = mommy.outputWeights[rowIndex][idx];
            }
        } else {
            for (let rowIndex = 0; rowIndex < outputWeights.length; ++rowIndex) {
                outputWeights[rowIndex][idx] = daddy.outputWeights[rowIndex][idx];
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
            hiddenWeights[rowIndex][idx] = randomWeight();
        } else {
            let rowIndex = Math.floor(Math.random() * outputWeights.length);
            let idx = Math.floor(Math.random() * outputWeights[0].length);
            outputWeights[rowIndex][idx] = randomWeight();
        }
    }

    /* Color */
    if (Math.random() < 0.5) {
        var color = mommy.color;
    } else {
        var color = daddy.color;
    }

    return {
        color: color,

        hiddenWeights: hiddenWeights,

        outputWeights: outputWeights,
    };
}
