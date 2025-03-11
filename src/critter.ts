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

import { computeBrainControl } from "./brain";
import { BASE_SPEED_ANGULAR, BASE_SPEED_FORWARD, CRITTER_COLOR, CRITTER_SIZE } from "./config";
import { svgCircle } from "./main";

export function createCritter(w, h, genome) {
    function getTransform(x, y, angle) {
        var degAngle = (-angle * 180) / Math.PI;
        return "translate(" + x + "," + y + ") rotate(" + degAngle + ")";
    }

    return {
        head: undefined as any,

        body: undefined as any,

        x: w * Math.random(),

        y: h * Math.random(),

        /* Range: -pi..pi */
        angle: 2.0 * Math.PI * (Math.random() - 0.5),

        genome: genome,

        brainControl: {
            leftSpeed: 0.0,
            rightSpeed: 0.0,
        },

        foodCount: 0,

        dangerCount: 0,

        updatePosition: function (timeDelta) {
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
            } else if (x >= w) {
                x = w - 1;
            }

            if (y < 0.0) {
                y = 0.0;
            } else if (y >= h) {
                y = h - 1;
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
        },

        updateBrainControl: function (stimuli) {
            this.brainControl = computeBrainControl(this.genome, stimuli);
        },

        createSvg: function (svg) {
            this.body = svgCircle(svg, 0 - 0.3 * CRITTER_SIZE, 0, 0.7 * CRITTER_SIZE);

            this.head = svgCircle(svg, 0.6 * CRITTER_SIZE, 0, 0.4 * CRITTER_SIZE);

            this.body.setAttribute("fill", CRITTER_COLOR);
            this.head.setAttribute("fill", CRITTER_COLOR);
        },

        renderSvg: function (offsetX, offsetY) {
            this.body.setAttribute(
                "transform",
                getTransform(this.x + offsetX, this.y + offsetY, this.angle),
            );
            this.head.setAttribute(
                "transform",
                getTransform(this.x + offsetX, this.y + offsetY, this.angle),
            );
            this.head.setAttribute("fill", this.genome.color);
        },

        getX: function () {
            return this.x;
        },

        getY: function () {
            return this.y;
        },

        getAngle() {
            return this.angle;
        },

        setPosition: function (x, y) {
            this.x = x;
            this.y = y;
        },
    };
}
