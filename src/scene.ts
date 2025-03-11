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

import {
    CRITTER_SIZE,
    NUM_CRITTERS,
    NUM_DANGER,
    NUM_FOOD,
    SCENT_DISTANCE_LIMIT,
    VISION_ANGLE_LIMIT,
    VISION_DISTANCE_LIMIT,
} from './config';
import { createCritter } from './critter';
import { randomGenome } from './genome';
import { createDanger, createFood, thingKind } from './thing';

export function createScene(w, h, doCreateCritters) {
    const millisPerSecond = 1000;
    var things = [] as any[];
    var critters = [] as any[];

    for (var idx = 0; idx < NUM_FOOD; ++idx) {
        things.push(createFood(w, h));
    }

    for (var idx = 0; idx < NUM_DANGER; ++idx) {
        things.push(createDanger(w, h));
    }

    /* For the displayed scene, critters are created when the scene is created.
     * For simulation scenes used for training, critters are added to the scene,
     * trained, then taken out and other critters are added to take their place,
     * etc. */
    if (doCreateCritters) {
        for (var idx = 0; idx < NUM_CRITTERS; ++idx) {
            critters.push(createCritter(w, h, randomGenome()));
        }
    }

    return {
        width: w,

        height: h,

        critters: critters as any[],

        lastUpdate: performance.now(),

        addCritter: function (critter) {
            this.critters.push(critter);
        },

        harvestCritter: function () {
            return this.critters.shift();
        },

        updateScene: function () {
            var now = performance.now();

            this.updatePosition((now - this.lastUpdate) / millisPerSecond);

            this.lastUpdate = performance.now();
        },

        updatePosition: function (timeDelta) {
            for (const thing of things) {
                thing.updatePosition(timeDelta);
            }

            for (const critter of this.critters) {
                critter.updatePosition(timeDelta);
            }

            for (const critter of this.critters) {
                let stimuli = this.computeStimuli(critter);

                /* Stimuli object is null if critter died this round. */
                if (stimuli != null) {
                    critter.updateBrainControl(stimuli);
                }
            }
        },

        /* Return value is a stimuli object if the critter is still alive or null
         * otherwise. If it "died", its position is changed to a random one to
         * simulate a new critter appearing elsewhere. */
        computeStimuli: function (critter) {
            let critterAngle = critter.getAngle();

            /* We store angles in the range -pi..pi. If the critter is looking
             * in a direction close to -pi or pi, we convert the range to 0..2*pi
             * so we don't have to deal with the discontinuity. */
            if (critterAngle > Math.PI / 2) {
                var zero2Pi = true;
            } else if (critterAngle < -Math.PI / 2) {
                critterAngle += 2 * Math.PI;
                var zero2Pi = true;
            } else {
                var zero2Pi = false;
            }

            let foodIntensity = 0.0;
            let foodAngle = 0.0;
            let foodOdor = 0.0;
            let dangerIntensity = 0.0;
            let dangerAngle = 0.0;
            let dangerOdor = 0.0;
            let wallIntensity = 0.0;
            let wallAngle = 0.0;
            let critterSizeSquared = CRITTER_SIZE * CRITTER_SIZE;

            for (let thing of things) {
                let kind = thing.getKind();

                let dx = thing.getX() - critter.getX();
                let dy = thing.getY() - critter.getY();
                let distanceSquared = dx * dx + dy * dy;

                /* Comparing distances is equivalent to comparing distances. Not
                 * computing the square root is faster. */
                if (distanceSquared < critterSizeSquared) {
                    if (kind == thingKind.FOOD) {
                        ++critter.foodCount;

                        /* simulate deleting the thing and adding a new one by
                         * changing its position */
                        this.setRandomPosition(thing);
                        continue;
                    } else if (kind == thingKind.DANGER) {
                        ++critter.dangerCount;

                        /* "dead" for this round  */
                        this.setRandomPosition(critter);
                        return null;
                    }
                }

                if (
                    distanceSquared < VISION_DISTANCE_LIMIT * VISION_DISTANCE_LIMIT ||
                    distanceSquared < SCENT_DISTANCE_LIMIT * SCENT_DISTANCE_LIMIT
                ) {
                    let distance = Math.sqrt(distanceSquared);

                    if (distance < VISION_DISTANCE_LIMIT) {
                        let targetAngle = Math.atan2(-dy, dx);

                        if (zero2Pi && targetAngle < 0.0) {
                            targetAngle += 2 * Math.PI;
                        }

                        let viewAngle = critterAngle - targetAngle;

                        if (viewAngle < VISION_ANGLE_LIMIT && viewAngle > -VISION_ANGLE_LIMIT) {
                            let intensity =
                                (VISION_DISTANCE_LIMIT - distance) * (1.0 / VISION_DISTANCE_LIMIT);

                            if (kind == thingKind.FOOD) {
                                if (intensity > foodIntensity) {
                                    foodIntensity = intensity;
                                    foodAngle = viewAngle * (1.0 / VISION_ANGLE_LIMIT);
                                }
                            } else if (kind == thingKind.DANGER) {
                                if (intensity > dangerIntensity) {
                                    dangerIntensity = intensity;
                                    dangerAngle = viewAngle * (1.0 / VISION_ANGLE_LIMIT);
                                }
                            }
                        }
                    }

                    if (distance < SCENT_DISTANCE_LIMIT) {
                        let intensity =
                            (SCENT_DISTANCE_LIMIT - distance) * (1.0 / SCENT_DISTANCE_LIMIT);

                        if (kind == thingKind.FOOD) {
                            if (intensity > foodOdor) {
                                foodOdor += intensity;
                            }
                        } else if (kind == thingKind.DANGER) {
                            if (intensity > dangerOdor) {
                                dangerOdor += intensity;
                            }
                        }
                    }
                }
            }

            if (critterAngle > 0.0) {
                /* top wall */
                let distance = critter.getY() / Math.sin(critterAngle);

                if (distance < VISION_DISTANCE_LIMIT) {
                    let intensity =
                        (VISION_DISTANCE_LIMIT - distance) * (1.0 / VISION_DISTANCE_LIMIT);

                    if (intensity > wallIntensity) {
                        wallIntensity = intensity;
                        wallAngle = (critterAngle - Math.PI / 2) * (1.0 / (Math.PI / 2));
                    }
                }
            } else if (critterAngle < -0.0) {
                /* bottom wall */
                let distance = (critter.getY() - this.height) / Math.sin(critterAngle);

                if (distance < VISION_DISTANCE_LIMIT) {
                    let intensity =
                        (VISION_DISTANCE_LIMIT - distance) * (1.0 / VISION_DISTANCE_LIMIT);

                    if (intensity > wallIntensity) {
                        wallIntensity = intensity;
                        wallAngle = (Math.PI / 2 + critterAngle) * (1.0 / (Math.PI / 2));
                    }
                }
            }

            if (critterAngle > -Math.PI / 2 && critterAngle < Math.PI / 2) {
                /* right wall */
                let distance = (this.width - critter.getX()) / Math.cos(critterAngle);

                if (distance < VISION_DISTANCE_LIMIT) {
                    let intensity =
                        (VISION_DISTANCE_LIMIT - distance) * (1.0 / VISION_DISTANCE_LIMIT);

                    if (intensity > wallIntensity) {
                        wallIntensity = intensity;
                        wallAngle = critterAngle * (1.0 / (Math.PI / 2));
                    }
                }
            } else if (critterAngle < -Math.PI / 2) {
                /* left wall */
                let distance = -critter.getX() / Math.cos(critterAngle);

                if (distance < VISION_DISTANCE_LIMIT) {
                    let intensity =
                        (VISION_DISTANCE_LIMIT - distance) * (1.0 / VISION_DISTANCE_LIMIT);

                    if (intensity > wallIntensity) {
                        wallIntensity = intensity;
                        wallAngle = (critterAngle - Math.PI) * (1.0 / (Math.PI / 2));
                    }
                }
            } else if (critterAngle > Math.PI / 2) {
                /* left wall */
                let distance = -critter.getX() / Math.cos(critterAngle);

                if (distance < VISION_DISTANCE_LIMIT) {
                    let intensity =
                        (VISION_DISTANCE_LIMIT - distance) * (1.0 / VISION_DISTANCE_LIMIT);

                    if (intensity > wallIntensity) {
                        wallIntensity = intensity;
                        wallAngle = (critterAngle + Math.PI) * (1.0 / (Math.PI / 2));
                    }
                }
            }

            return {
                foodIntensity: foodIntensity,
                foodAngle: foodAngle,
                foodOdor: foodOdor,
                dangerIntensity: dangerIntensity,
                dangerAngle: dangerAngle,
                dangerOdor: dangerOdor,
                wallIntensity: wallIntensity,
                wallAngle: wallAngle,
            };
        },

        setRandomPosition: function (thing) {
            thing.setPosition(this.width * Math.random(), this.height * Math.random());
        },

        createSvg: function (svg) {
            for (const thing of things) {
                thing.createSvg(svg);
            }
            for (const critter of this.critters) {
                critter.createSvg(svg);
            }
        },

        renderSvg: function (offsetX, offsetY) {
            for (const thing of things) {
                thing.renderSvg(offsetX, offsetY);
            }
            for (const critter of this.critters) {
                critter.renderSvg(offsetX, offsetY);
            }
        },
    };
}
