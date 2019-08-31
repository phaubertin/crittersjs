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

function randomWeight() {
    return 2.0 * GENOME_WEIGHT_AMPLITUDE * (Math.random() - 0.5);
}

function randomColor() {
    return 'rgb(' +
        Math.floor(50 + 200 * Math.random()).toString() + ', ' +
        Math.floor(50 + 200 * Math.random()).toString() + ', ' +
        Math.floor(50 + 200 * Math.random()).toString() + ')';
}

function randomWeightMatrix(rows, cols) {
    var matrix = new Array(rows);
    
    for(var rowIndex = 0; rowIndex < matrix.length; ++rowIndex) {
        var row = new Array(cols);
        
        for(var idx = 0; idx < row.length; ++idx) {
            row[idx] = randomWeight();
        }
        
        matrix[rowIndex] = row;
    }
    
    return matrix;
}

function randomGenome() {
    return {
        color : randomColor(),
        
        hiddenWeights : randomWeightMatrix(GENOME_HIDDEN_RELU, BRAIN_NUM_INPUTS + 1),
        
        outputWeights : randomWeightMatrix(BRAIN_NUM_OUTPUTS, GENOME_HIDDEN_RELU + 1)
    }
}
