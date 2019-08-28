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

function createGenome() {
    return {
        color : 'rgb(100, 150, 100)',
        
        hiddenWeights : [
            [
              9.87724,
             12.30365,
            -16.01356,
             16.45348,
              0.63396,
             -9.23886,
            -14.07352,
             -8.23737,
              4.50769
            ],
            [
             15.90460,
            -11.20224,
            -14.47871,
             13.13194,
              2.82593,
             14.36143,
             12.02368,
              2.09507,
              9.03901
            ],
            [
            -12.79564,
            -16.96451,
             10.37976,
            -17.24494,
              9.09004,
            -13.78505,
              5.93817,
            -12.07426,
             19.47459
            ],
            [
            -17.03996,
              3.81685,
             11.97808,
             19.32081,
            -18.55547,
            -10.23613,
             -4.53404,
              7.50816,
            -13.90607
            ],
            [
             10.05390,
             18.96211,
             16.88631,
             13.56943,
             -3.10746,
             11.68708,
              6.51691,
            -10.89220,
             12.28700
            ],

            [
            -15.16115,
            -12.39309,
            -11.79509,
             -1.01214,
            -10.06004,
            -10.81542,
              5.17680,
             18.33312,
             13.29181
            ],
            [
              8.53815,
             -7.11184,
            -18.13076,
            -13.40597,
            -15.13701,
              7.96544,
            -12.95417,
             14.67698,
              7.55607
            ],
            [
            -15.06761,
            -17.75749,
              6.63475,
             -8.34326,
             -3.80566,
             -8.27378,
            -19.33519,
              9.39084,
              5.37329
            ]
        ],
        
        outputWeights : [
            [
             -6.29718,
             -5.21027,
            -14.48652,
             -7.72577,
             -6.42647,
             17.84115,
             -3.18146,
             -2.54062,
              5.17784
            ],
            [
            -10.15089,
              6.49166,
             19.79419,
            -18.37718,
             17.73203,
            -18.59561,
             -4.41470,
              5.25516,
             -5.98978
            ]
        ]
    }
}

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
