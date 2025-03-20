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

import { Color } from './color';

export const config = {
    critter: {
        baseSpeed: {
            // in viewbox pixels per second
            forward: 100,
            // in radian per second
            angular: 0.2 * Math.PI,
        },
        color: Color.rgb(100, 100, 200),
        howMany: 5,
        smell: {
            distance: 250,
        },
        size: 10,
        vision: {
            angle: (0.7 * Math.PI) / 2,
            distance: 600,
        },
    },
    danger: {
        color: Color.rgb(200, 0, 0),
        howMany: 2,
        size: 16,
        speed: 40,
    },
    fitnessScore: {
        // number of points gained each time food is captured
        foodWeight: 1,
        // number of points gained (negative for loss) each time the critter is captured
        dangerWeight: -50,
    },
    food: {
        color: Color.rgb(0, 200, 0),
        howMany: 4,
        size: 6,
        speed: 10,
    },
    geneticAlgorithm: {
        bestWeight: 4,
        discardWorst: 50,
        keepBest: 9,
        keepRandom: 48,
        newRandom: 6,
        populationSize: 200,
    },
    neuralNetwork: {
        // number of neurons in the hidden layer
        howManyHidden: 8,
        // All weights are between plus or minus this value.
        weightAmplitude: 20,
    },
    scene: {
        border: 10,
        colors: {
            background: Color.rgb(0, 0, 0),
            border: Color.rgb(200, 200, 200),
            scene: Color.rgb(32, 32, 32),
        },
        height: 400,
        margin: 20,
        width: 800,
    },
    simulation: {
        // in seconds
        duration: 40,
        // in milliseconds
        step: 200,
    },
    worker: {
        filename: 'critters-worker.js',
        // in seconds
        firstUpdate: 2,
        generations: 1000,
        // in generations
        logInterval: 50,
        // in seconds
        updateInterval: 10,
    },
};
