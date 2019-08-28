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

const SCENE_WIDTH  = 800

const SCENE_HEIGHT = 500

const SCENE_BORDER = 10

const SCENE_MARGIN = 20

const BACKGROUND_COLOR = 'black'

const BORDER_COLOR = 'rgb(200, 200, 200)'

const SCENE_COLOR = 'rgb(32, 32, 32)'

const NUM_FOOD = 4

const FOOD_COLOR = 'rgb(0, 200, 0)'

const FOOD_SPEED = 10.0

const FOOD_SIZE = 6.0

const NUM_DANGER = 2

const DANGER_COLOR = 'rgb(200, 0, 0)'

const DANGER_SPEED = 40.0

const DANGER_SIZE = 16.0

const NUM_CRITTERS = 5

const CRITTER_COLOR = 'rgb(100, 100, 200)'

const CRITTER_SIZE = 10.0

const VISION_DISTANCE_LIMIT = 600.0

const VISION_ANGLE_LIMIT = 0.7 * Math.PI / 2

const SCENT_DISTANCE_LIMIT = 250.0

/* In viewbox pixels per second */
const BASE_SPEED_FORWARD = 100.0

/* In radian per second */
const BASE_SPEED_ANGULAR = 0.2 * Math.PI
