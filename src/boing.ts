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

export class Boing {
    private goLeft: boolean;
    private goDown: boolean;
    private x: number;
    private y: number;

    constructor(
        private readonly sceneWidth: number,
        private readonly sceneHeight: number,
        private readonly speed: number,
    ) {
        this.x = sceneWidth * Math.random();
        this.y = sceneHeight * Math.random();

        const rand = Math.random();

        if (rand < 0.25) {
            this.goLeft = false;
            this.goDown = false;
        } else if (rand < 0.5) {
            this.goLeft = false;
            this.goDown = true;
        } else if (rand < 0.75) {
            this.goLeft = true;
            this.goDown = false;
        } else {
            this.goLeft = true;
            this.goDown = true;
        }
    }

    updatePosition(timeDelta: number): void {
        const deltaXY = timeDelta * this.speed * Math.SQRT1_2;

        if (this.goLeft) {
            this.x += deltaXY;
        } else {
            this.x -= deltaXY;
        }

        if (this.goDown) {
            this.y += deltaXY;
        } else {
            this.y -= deltaXY;
        }

        if (this.x >= this.sceneWidth) {
            this.x = this.sceneWidth - 1.0;
            this.goLeft = false;
        } else if (this.x < 0) {
            this.x = 0;
            this.goLeft = true;
        }

        if (this.y >= this.sceneHeight) {
            this.y = this.sceneHeight - 1.0;
            this.goDown = false;
        } else if (this.y < 0) {
            this.y = 0;
            this.goDown = true;
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
}
