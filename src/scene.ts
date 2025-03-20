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

import { BrainStimuli } from './brain';
import { config } from './config';
import { MILLISECONDS_PER_SECOND } from './constants';
import { Critter } from './critter';
import { Genome } from './genome';
import { SvgCanvas } from './svg';
import { Danger, Food, Thing, ThingKind } from './thing';

export class Scene {
    private readonly critters: Critter[];
    private readonly things: Thing[];
    private lastUpdate: DOMHighResTimeStamp;

    constructor(doAddCritters: boolean) {
        this.critters = [];
        this.things = [];

        for (let idx = 0; idx < config.food.howMany; ++idx) {
            this.addThing(new Food(config.scene.width, config.scene.height));
        }

        for (let idx = 0; idx < config.danger.howMany; ++idx) {
            this.addThing(new Danger(config.scene.width, config.scene.height));
        }

        /* For the displayed scene, critters are created when the scene is created.
         * For simulation scenes used for training, critters are added to the scene,
         * trained, then taken out and other critters are added to take their place,
         * etc. */
        if (doAddCritters) {
            for (let idx = 0; idx < config.critter.howMany; ++idx) {
                this.addCritter(
                    new Critter(Genome.random(), config.scene.width, config.scene.height),
                );
            }
        }

        this.lastUpdate = performance.now();
    }

    addCritter(critter: Critter): void {
        this.critters.push(critter);
    }

    addThing(thing: Thing): void {
        this.things.push(thing);
    }

    harvestCritter(): Critter | null {
        return this.critters.shift() ?? null;
    }

    getCritter(index: number): Critter | undefined {
        return this.critters[index];
    }

    updateScene(): void {
        const now = performance.now();

        this.updatePosition((now - this.lastUpdate) / MILLISECONDS_PER_SECOND);

        this.lastUpdate = now;
    }

    updatePosition(timeDelta: number): void {
        for (const thing of this.things) {
            thing.updatePosition(timeDelta);
        }

        for (const critter of this.critters) {
            critter.updatePosition(timeDelta);
        }

        for (const critter of this.critters) {
            const stimuli = this.computeStimuli(critter);

            /* Stimuli object is null if critter died this round. */
            if (stimuli != null) {
                critter.updateControl(stimuli);
            }
        }
    }

    /* Return value is a stimuli object if the critter is still alive or null
     * otherwise. If it "died", its position is changed to a random one to
     * simulate a new critter appearing elsewhere. */
    private computeStimuli(critter: Critter): BrainStimuli | null {
        /* We store angles in the range -pi..pi. If the critter is looking
         * in a direction close to -pi or pi, we convert the range to 0..2*pi
         * so we don't have to deal with the discontinuity. */
        let critterAngle = critter.getAngle();
        let zero2Pi: boolean;

        if (critterAngle > Math.PI / 2) {
            zero2Pi = true;
        } else if (critterAngle < -Math.PI / 2) {
            critterAngle += 2 * Math.PI;
            zero2Pi = true;
        } else {
            zero2Pi = false;
        }

        let critterSizeSquared = config.critter.size * config.critter.size;
        let dangerAngle = 0.0;
        let dangerIntensity = 0.0;
        let dangerOdor = 0.0;
        let foodAngle = 0.0;
        let foodIntensity = 0.0;
        let foodOdor = 0.0;
        let wallAngle = 0.0;
        let wallIntensity = 0.0;

        for (let thing of this.things) {
            const kind = thing.getKind();

            const dx = thing.getX() - critter.getX();
            const dy = thing.getY() - critter.getY();
            const distanceSquared = dx * dx + dy * dy;

            /* Comparing squared distances is equivalent to comparing distances. Not
             * computing the square root is faster. */
            if (distanceSquared < critterSizeSquared) {
                if (kind == ThingKind.food) {
                    critter.eat();
                    /* simulate deleting the thing and adding a new one by
                     * changing its position */
                    thing.setRandomPosition();
                    continue;
                } else if (kind == ThingKind.danger) {
                    critter.kill();
                    /* "dead" for this round  */
                    critter.setRandomPosition();
                    return null;
                }
            }

            if (
                distanceSquared < config.critter.vision.distance * config.critter.vision.distance ||
                distanceSquared < config.critter.smell.distance * config.critter.smell.distance
            ) {
                const distance = Math.sqrt(distanceSquared);

                if (distance < config.critter.vision.distance) {
                    let targetAngle = Math.atan2(-dy, dx);

                    if (zero2Pi && targetAngle < 0.0) {
                        targetAngle += 2 * Math.PI;
                    }

                    const viewAngle = critterAngle - targetAngle;

                    if (
                        viewAngle < config.critter.vision.angle &&
                        viewAngle > -config.critter.vision.angle
                    ) {
                        const intensity =
                            (config.critter.vision.distance - distance) *
                            (1.0 / config.critter.vision.distance);

                        if (kind == ThingKind.food) {
                            if (intensity > foodIntensity) {
                                foodIntensity = intensity;
                                foodAngle = viewAngle * (1.0 / config.critter.vision.angle);
                            }
                        } else if (kind == ThingKind.danger) {
                            if (intensity > dangerIntensity) {
                                dangerIntensity = intensity;
                                dangerAngle = viewAngle * (1.0 / config.critter.vision.angle);
                            }
                        }
                    }
                }

                if (distance < config.critter.smell.distance) {
                    const intensity =
                        (config.critter.smell.distance - distance) *
                        (1.0 / config.critter.smell.distance);

                    if (kind == ThingKind.food) {
                        if (intensity > foodOdor) {
                            foodOdor += intensity;
                        }
                    } else if (kind == ThingKind.danger) {
                        if (intensity > dangerOdor) {
                            dangerOdor += intensity;
                        }
                    }
                }
            }
        }

        if (critterAngle > 0.0) {
            /* top wall */
            const distance = critter.getY() / Math.sin(critterAngle);

            if (distance < config.critter.vision.distance) {
                const intensity =
                    (config.critter.vision.distance - distance) *
                    (1.0 / config.critter.vision.distance);

                if (intensity > wallIntensity) {
                    wallIntensity = intensity;
                    wallAngle = (critterAngle - Math.PI / 2) * (1.0 / (Math.PI / 2));
                }
            }
        } else if (critterAngle < -0.0) {
            /* bottom wall */
            const distance = (critter.getY() - config.scene.height) / Math.sin(critterAngle);

            if (distance < config.critter.vision.distance) {
                const intensity =
                    (config.critter.vision.distance - distance) *
                    (1.0 / config.critter.vision.distance);

                if (intensity > wallIntensity) {
                    wallIntensity = intensity;
                    wallAngle = (Math.PI / 2 + critterAngle) * (1.0 / (Math.PI / 2));
                }
            }
        }

        if (critterAngle > -Math.PI / 2 && critterAngle < Math.PI / 2) {
            /* right wall */
            const distance = (config.scene.width - critter.getX()) / Math.cos(critterAngle);

            if (distance < config.critter.vision.distance) {
                const intensity =
                    (config.critter.vision.distance - distance) *
                    (1.0 / config.critter.vision.distance);

                if (intensity > wallIntensity) {
                    wallIntensity = intensity;
                    wallAngle = critterAngle * (1.0 / (Math.PI / 2));
                }
            }
        } else if (critterAngle < -Math.PI / 2 || critterAngle > Math.PI / 2) {
            /* left wall */
            const distance = -critter.getX() / Math.cos(critterAngle);

            if (distance < config.critter.vision.distance) {
                const intensity =
                    (config.critter.vision.distance - distance) *
                    (1.0 / config.critter.vision.distance);

                if (intensity > wallIntensity) {
                    const sign = critterAngle < 0 ? -1 : 1;
                    wallIntensity = intensity;
                    wallAngle = (critterAngle + sign * Math.PI) * (1.0 / (Math.PI / 2));
                }
            }
        }

        return {
            dangerAngle,
            dangerIntensity,
            dangerOdor,
            foodAngle,
            foodIntensity,
            foodOdor,
            wallAngle,
            wallIntensity,
        };
    }

    createSvg(svg: SvgCanvas): void {
        this.createBackground(svg);

        for (const thing of this.things) {
            thing.createSvg(svg);
        }
        for (const critter of this.critters) {
            critter.createSvg(svg);
        }
    }

    private createBackground(svg: SvgCanvas): void {
        /*  +----------------------------------------------------------------+
         *  |////////////////////////////////////////////////////////////////|
         *  |//+----------------------------------------------------------+//|
         *  |//|//////////////////////////////////////////////////////////|//|
         *  |//|//+----------------------------------------------------+//|//|
         *  |//|//|                                                    |//|//|
         *  |//|//|                      Scene                         |//|//|
         *  |//|//|                                                    |//|//|
         *  |//|//+----------------------------------------------------+//|//|
         *  |//|///////////////////////////////////////Border/////////////|//|
         *  |//+----------------------------------------------------------+//|
         *  |//////////////////////////////////////////Background////////////|
         *  +----------------------------------------------------------------+
         *
         * */
        const backgroundWidth = config.scene.width + 2 * config.scene.margin;
        const backgroundHeight = config.scene.height + 2 * config.scene.margin;

        svg.setViewbox(backgroundWidth, backgroundHeight);

        const background = svg.addRectangle(0, 0, backgroundWidth, backgroundHeight);

        background.setFillColor(config.scene.colors.background);

        const border = svg.addRectangle(
            config.scene.border,
            config.scene.border,
            config.scene.width + 2 * config.scene.border,
            config.scene.height + 2 * config.scene.border,
        );
        border.setStrokeColor(config.scene.colors.border);

        const scene = svg.addRectangle(
            config.scene.margin,
            config.scene.margin,
            config.scene.width,
            config.scene.height,
        );

        scene.setFillColor(config.scene.colors.scene);
    }

    renderSvg(): void {
        for (const thing of this.things) {
            thing.renderSvg(config.scene.margin, config.scene.margin);
        }
        for (const critter of this.critters) {
            critter.renderSvg(config.scene.margin, config.scene.margin);
        }
    }
}
