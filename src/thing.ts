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

import { Boing } from './boing';
import {
    DANGER_COLOR,
    DANGER_SIZE,
    DANGER_SPEED,
    FOOD_COLOR,
    FOOD_SIZE,
    FOOD_SPEED,
} from './config';
import { SvgCanvas, SvgShape } from './svg';

export enum ThingKind {
    food,
    danger,
}

export class Food {
    private boing: Boing;
    private circle: SvgShape | undefined;

    constructor(width: number, height: number) {
        this.boing = new Boing(width, height, FOOD_SPEED);
    }

    getKind(): ThingKind.food {
        return ThingKind.food;
    }

    setPosition(x: number, y: number): void {
        this.boing.setPosition(x, y);
    }

    updatePosition(timeDelta: number): void {
        this.boing.updatePosition(timeDelta);
    }

    getX(): number {
        return this.boing.getX();
    }

    getY(): number {
        return this.boing.getY();
    }

    createSvg(svg: SvgCanvas): void {
        this.circle = svg.addCircle(0, 0, FOOD_SIZE);
        this.circle.setFillColor(FOOD_COLOR);
    }

    renderSvg(offsetX: number, offsetY: number): void {
        if (!this.circle) {
            return;
        }
        this.circle.setTranslate(this.boing.getX() + offsetX, this.boing.getY() + offsetY);
    }
}

export class Danger {
    private boing: Boing;
    private rect: SvgShape | undefined;

    constructor(width: number, height: number) {
        this.boing = new Boing(width, height, DANGER_SPEED);
    }

    getKind(): ThingKind.danger {
        return ThingKind.danger;
    }

    setPosition(x: number, y: number): void {
        this.boing.setPosition(x, y);
    }

    updatePosition(timeDelta: number): void {
        this.boing.updatePosition(timeDelta);
    }

    getX(): number {
        return this.boing.getX();
    }

    getY(): number {
        return this.boing.getY();
    }

    createSvg(svg: SvgCanvas): void {
        this.rect = svg.addRectangle(
            0 - DANGER_SIZE / 2,
            0 - DANGER_SIZE / 2,
            DANGER_SIZE * Math.SQRT1_2,
            DANGER_SIZE * Math.SQRT1_2,
        );
        this.rect.setFillColor(DANGER_COLOR);
        this.rect.setRotate(45);
    }

    renderSvg(offsetX: number, offsetY: number): void {
        if (!this.rect) {
            return;
        }
        this.rect.setTranslate(this.boing.getX() + offsetX, this.boing.getY() + offsetY);
    }
}
