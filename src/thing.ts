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
import { config } from './config';
import { SvgCanvas, SvgShape } from './svg';

export enum ThingKind {
    food,
    danger,
}

export interface Thing {
    getKind(): ThingKind;
    updatePosition(timeDelta: number): void;
    setPosition(x: number, y: number): void;
    setRandomPosition(): void;
    getX(): number;
    getY(): number;
    createSvg(svg: SvgCanvas): void;
    renderSvg(offsetX: number, offsetY: number): void;
}

export class Food implements Thing {
    private boing: Boing;
    private circle: SvgShape | undefined;

    constructor(sceneWidth: number, sceneHeight: number) {
        this.boing = new Boing(sceneWidth, sceneHeight, config.food.speed);
    }

    getKind(): ThingKind.food {
        return ThingKind.food;
    }

    updatePosition(timeDelta: number): void {
        this.boing.updatePosition(timeDelta);
    }

    setPosition(x: number, y: number): void {
        this.boing.setPosition(x, y);
    }

    setRandomPosition(): void {
        this.boing.setRandomPosition();
    }

    getX(): number {
        return this.boing.getX();
    }

    getY(): number {
        return this.boing.getY();
    }

    createSvg(svg: SvgCanvas): void {
        this.circle = svg.addCircle(0, 0, config.food.size);
        this.circle.setFillColor(config.food.color);
    }

    renderSvg(offsetX: number, offsetY: number): void {
        if (!this.circle) {
            return;
        }
        this.circle.setTranslate(this.boing.getX() + offsetX, this.boing.getY() + offsetY);
    }
}

export class Danger implements Thing {
    private boing: Boing;
    private rect: SvgShape | undefined;

    constructor(sceneWidth: number, sceneHeight: number) {
        this.boing = new Boing(sceneWidth, sceneHeight, config.danger.speed);
    }

    getKind(): ThingKind.danger {
        return ThingKind.danger;
    }

    updatePosition(timeDelta: number): void {
        this.boing.updatePosition(timeDelta);
    }

    setPosition(x: number, y: number): void {
        this.boing.setPosition(x, y);
    }

    setRandomPosition(): void {
        this.boing.setRandomPosition();
    }

    getX(): number {
        return this.boing.getX();
    }

    getY(): number {
        return this.boing.getY();
    }

    createSvg(svg: SvgCanvas): void {
        this.rect = svg.addRectangle(
            0 - config.danger.size / 2,
            0 - config.danger.size / 2,
            config.danger.size * Math.SQRT1_2,
            config.danger.size * Math.SQRT1_2,
        );
        this.rect.setFillColor(config.danger.color);
        this.rect.setRotate(45);
    }

    renderSvg(offsetX: number, offsetY: number): void {
        if (!this.rect) {
            return;
        }
        this.rect.setTranslate(this.boing.getX() + offsetX, this.boing.getY() + offsetY);
    }
}
