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

import { Brain, BrainControlOutput, BrainStimuli } from './brain';
import {
    BASE_SPEED_ANGULAR,
    BASE_SPEED_FORWARD,
    CRITTER_COLOR,
    CRITTER_SIZE,
    DANGER_COST,
    FOOD_COST,
} from './config';
import { Genome } from './genome';
import { SvgCanvas, SvgShape } from './svg';

export class Critter {
    private x: number;
    private y: number;
    private angle: number;
    private ateFoodCount: number;
    private diedCount: number;
    private brainControl: BrainControlOutput;
    private head: SvgShape | undefined;
    private body: SvgShape | undefined;

    constructor(
        private genome: Genome,
        private readonly sceneWidth: number,
        private readonly sceneHeight: number,
    ) {
        this.x = sceneWidth * Math.random();
        this.y = sceneHeight * Math.random();
        this.angle = 2.0 * Math.PI * (Math.random() - 0.5);
        this.ateFoodCount = 0;
        this.diedCount = 0;
        this.brainControl = {
            leftSpeed: 0,
            rightSpeed: 0,
        };
    }

    eat(): void {
        ++this.ateFoodCount;
    }

    kill(): void {
        ++this.diedCount;
    }

    computeFitness(): number {
        return FOOD_COST * this.ateFoodCount + DANGER_COST * this.diedCount;
    }

    updateControl(stimuli: BrainStimuli): void {
        this.brainControl = Brain.computeControl(this.genome, stimuli);
    }

    updatePosition(timeDelta: number): void {
        /* Update position. */

        let speed =
            BASE_SPEED_FORWARD *
            /* Arithmetic mean */
            (this.brainControl.rightSpeed + this.brainControl.leftSpeed) *
            0.5;

        let distance = timeDelta * speed;
        let x = this.x + Math.cos(this.angle) * distance;
        let y = this.y - Math.sin(this.angle) * distance;

        if (x < 0.0) {
            x = 0.0;
        } else if (x >= this.sceneWidth) {
            x = this.sceneWidth - 1;
        }

        if (y < 0.0) {
            y = 0.0;
        } else if (y >= this.sceneHeight) {
            y = this.sceneHeight - 1;
        }

        this.setPosition(x, y);

        /* Update angle. */

        let omega =
            BASE_SPEED_ANGULAR * (this.brainControl.rightSpeed - this.brainControl.leftSpeed);
        let deltaAngle = timeDelta * omega;

        this.angle += deltaAngle;

        while (this.angle < -Math.PI) {
            this.angle += 2 * Math.PI;
        }

        while (this.angle > Math.PI) {
            this.angle -= 2 * Math.PI;
        }
    }

    setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    setRandomPosition(): void {
        this.setPosition(this.sceneWidth * Math.random(), this.sceneHeight * Math.random());
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }

    getAngle(): number {
        return this.angle;
    }

    getGenome(): Genome {
        return this.genome;
    }

    setGenome(genome: Genome): void {
        this.genome = genome;
    }

    createSvg(svg: SvgCanvas): void {
        this.body = svg.addCircle(0 - 0.3 * CRITTER_SIZE, 0, 0.7 * CRITTER_SIZE);
        this.head = svg.addCircle(0.6 * CRITTER_SIZE, 0, 0.4 * CRITTER_SIZE);

        this.body.setFillColor(CRITTER_COLOR);
        this.head.setFillColor(CRITTER_COLOR);
    }

    renderSvg(offsetX: number, offsetY: number): void {
        if (!(this.head && this.body)) {
            return;
        }

        const degAngle = (-this.angle * 180) / Math.PI;
        this.body.setTranslate(this.x + offsetX, this.y + offsetY);
        this.head.setTranslate(this.x + offsetX, this.y + offsetY);
        this.body.setRotate(degAngle);
        this.head.setRotate(degAngle);
        this.head.setFillColor(this.genome.color);
    }
}
