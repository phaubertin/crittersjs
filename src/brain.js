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
 
const BRAIN_NUM_INPUTS = 8;

const BRAIN_NUM_OUTPUTS = 2;

function computeReluActivation(x) {
    if(x < 0.0) {
        return 0.0;
    }
    else {
        return x;
    }
}
/* Piecewise polynomial approximation of a sigmoid-like curve
 * 
 * The value of the function is zero for arguments under -5 and one for 
 * arguments over 5. Between -5 and 5, the value of the function is the value of
 * a degree 3 polynomial with the following characteristics:
 * 
 *  - The polynomial has value 0 at -5 and 1 at 5 so as not to have
 *    discontinuities.
 *  - The first derivative is zero at -5 and 5 to prevent discontinuities of
 *    that derivative.
 * 
 *  */
function computeSigmoishActivation(x) {
    if(x < -5.0) {
        return -1.0;
    }
    else if(x > 5.0) {
        return 1.0
    }
    else {
        /* Compute polynomial:
         *      poly(x) =  -0.002 * x^3 + 0.15 * x + 0.5
         *              = (-0.002 * x^2 + 0.15) * x + 0.5 */
        return (-0.002 * x * x + 0.15) * x + 0.5;
    }
}

function computeBrainControl(genome, stimuli) {
    let hidden  = new Array(genome.hiddenWeights.length)
    let output  = new Array(2)
    let input   = [
        stimuli.foodIntensity,
        stimuli.foodAngle,
        stimuli.dangerIntensity,
        stimuli.dangerAngle,
        stimuli.wallIntensity,
        stimuli.wallAngle,
        stimuli.foodOdor,
        stimuli.dangerOdor
    ]
    
    /* Compute hidden layer. */
    
    for(var idx = 0; idx < hidden.length; ++idx) {
        /* First weight is bias. */
        let acc = genome.hiddenWeights[idx][0];
        
        for(var idy = 0; idy < genome.hiddenWeights[idx].length - 1; ++idy) {
            acc += input[idy] * genome.hiddenWeights[idx][idy+1];
        }
        
        hidden[idx] = computeReluActivation(acc);
    }
    
    /* Compute output layer. */
    
    for(var idx = 0; idx < output.length; ++idx) {
        let acc = genome.outputWeights[idx][0];
        
        for(var idy = 0; idy < genome.outputWeights[idx].length - 1; ++idy) {
            acc += hidden[idy] * genome.outputWeights[idx][idy+1];
        }
        
        output[idx] = computeSigmoishActivation(acc);
    }
    
    return {
        leftSpeed   : output[0],
        rightSpeed  : output[1]
    }
}
