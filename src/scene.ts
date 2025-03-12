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
import {
    CRITTER_SIZE,
    NUM_CRITTERS,
    NUM_DANGER,
    NUM_FOOD,
    SCENT_DISTANCE_LIMIT,
    VISION_ANGLE_LIMIT,
    VISION_DISTANCE_LIMIT,
} from './config';
import { MILLISECONDS_PER_SECOND } from './constants';
import { Critter } from './critter';
import { randomGenome } from './genome';
import { SvgCanvas } from './svg';
import { Danger, Food, Thing, ThingKind } from './thing';

export class Scene {
    private readonly critters: Critter[];
    private readonly things: Thing[];
    private lastUpdate: DOMHighResTimeStamp;

    constructor(
        private readonly width: number,
        private readonly height: number,
        doAddCritters: boolean,
    ) {
        this.critters = [];
        this.things = [];

        for (let idx = 0; idx < NUM_FOOD; ++idx) {
            this.addThing(new Food(width, height));
        }

        for (let idx = 0; idx < NUM_DANGER; ++idx) {
            this.addThing(new Danger(width, height));
        }

        /* For the displayed scene, critters are created when the scene is created.
         * For simulation scenes used for training, critters are added to the scene,
         * trained, then taken out and other critters are added to take their place,
         * etc. */
        if (doAddCritters) {
            for (let idx = 0; idx < NUM_CRITTERS; ++idx) {
                this.addCritter(new Critter(randomGenome(), width, height));
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
            let stimuli = this.computeStimuli(critter);

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

        let critterSizeSquared = CRITTER_SIZE * CRITTER_SIZE;
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
                    this.setRandomPosition(thing);
                    continue;
                } else if (kind == ThingKind.danger) {
                    critter.kill();

                    /* "dead" for this round  */
                    this.setRandomPosition(critter);
                    return null;
                }
            }

            if (
                distanceSquared < VISION_DISTANCE_LIMIT * VISION_DISTANCE_LIMIT ||
                distanceSquared < SCENT_DISTANCE_LIMIT * SCENT_DISTANCE_LIMIT
            ) {
                const distance = Math.sqrt(distanceSquared);

                if (distance < VISION_DISTANCE_LIMIT) {
                    let targetAngle = Math.atan2(-dy, dx);

                    if (zero2Pi && targetAngle < 0.0) {
                        targetAngle += 2 * Math.PI;
                    }

                    const viewAngle = critterAngle - targetAngle;

                    if (viewAngle < VISION_ANGLE_LIMIT && viewAngle > -VISION_ANGLE_LIMIT) {
                        const intensity =
                            (VISION_DISTANCE_LIMIT - distance) * (1.0 / VISION_DISTANCE_LIMIT);

                        if (kind == ThingKind.food) {
                            if (intensity > foodIntensity) {
                                foodIntensity = intensity;
                                foodAngle = viewAngle * (1.0 / VISION_ANGLE_LIMIT);
                            }
                        } else if (kind == ThingKind.danger) {
                            if (intensity > dangerIntensity) {
                                dangerIntensity = intensity;
                                dangerAngle = viewAngle * (1.0 / VISION_ANGLE_LIMIT);
                            }
                        }
                    }
                }

                if (distance < SCENT_DISTANCE_LIMIT) {
                    const intensity =
                        (SCENT_DISTANCE_LIMIT - distance) * (1.0 / SCENT_DISTANCE_LIMIT);

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

            if (distance < VISION_DISTANCE_LIMIT) {
                const intensity =
                    (VISION_DISTANCE_LIMIT - distance) * (1.0 / VISION_DISTANCE_LIMIT);

                if (intensity > wallIntensity) {
                    wallIntensity = intensity;
                    wallAngle = (critterAngle - Math.PI / 2) * (1.0 / (Math.PI / 2));
                }
            }
        } else if (critterAngle < -0.0) {
            /* bottom wall */
            const distance = (critter.getY() - this.height) / Math.sin(critterAngle);

            if (distance < VISION_DISTANCE_LIMIT) {
                const intensity =
                    (VISION_DISTANCE_LIMIT - distance) * (1.0 / VISION_DISTANCE_LIMIT);

                if (intensity > wallIntensity) {
                    wallIntensity = intensity;
                    wallAngle = (Math.PI / 2 + critterAngle) * (1.0 / (Math.PI / 2));
                }
            }
        }

        if (critterAngle > -Math.PI / 2 && critterAngle < Math.PI / 2) {
            /* right wall */
            const distance = (this.width - critter.getX()) / Math.cos(critterAngle);

            if (distance < VISION_DISTANCE_LIMIT) {
                const intensity =
                    (VISION_DISTANCE_LIMIT - distance) * (1.0 / VISION_DISTANCE_LIMIT);

                if (intensity > wallIntensity) {
                    wallIntensity = intensity;
                    wallAngle = critterAngle * (1.0 / (Math.PI / 2));
                }
            }
        } else if (critterAngle < -Math.PI / 2) {
            /* left wall */
            const distance = -critter.getX() / Math.cos(critterAngle);

            if (distance < VISION_DISTANCE_LIMIT) {
                const intensity =
                    (VISION_DISTANCE_LIMIT - distance) * (1.0 / VISION_DISTANCE_LIMIT);

                if (intensity > wallIntensity) {
                    wallIntensity = intensity;
                    wallAngle = (critterAngle - Math.PI) * (1.0 / (Math.PI / 2));
                }
            }
        } else if (critterAngle > Math.PI / 2) {
            /* left wall */
            const distance = -critter.getX() / Math.cos(critterAngle);

            if (distance < VISION_DISTANCE_LIMIT) {
                const intensity =
                    (VISION_DISTANCE_LIMIT - distance) * (1.0 / VISION_DISTANCE_LIMIT);

                if (intensity > wallIntensity) {
                    wallIntensity = intensity;
                    wallAngle = (critterAngle + Math.PI) * (1.0 / (Math.PI / 2));
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

    private setRandomPosition(thing: Thing | Critter): void {
        thing.setPosition(this.width * Math.random(), this.height * Math.random());
    }

    createSvg(svg: SvgCanvas): void {
        for (const thing of this.things) {
            thing.createSvg(svg);
        }
        for (const critter of this.critters) {
            critter.createSvg(svg);
        }
    }

    renderSvg(offsetX: number, offsetY: number): void {
        for (const thing of this.things) {
            thing.renderSvg(offsetX, offsetY);
        }
        for (const critter of this.critters) {
            critter.renderSvg(offsetX, offsetY);
        }
    }
}
