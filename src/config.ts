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

export const SCENE_WIDTH = 800;

export const SCENE_HEIGHT = 500;

export const SCENE_BORDER = 10;

export const SCENE_MARGIN = 20;

export const BACKGROUND_COLOR = "black";

export const BORDER_COLOR = "rgb(200, 200, 200)";

export const SCENE_COLOR = "rgb(32, 32, 32)";

export const NUM_FOOD = 4;

export const FOOD_COLOR = "rgb(0, 200, 0)";

export const FOOD_SPEED = 10.0;

export const FOOD_SIZE = 6.0;

export const NUM_DANGER = 2;

export const DANGER_COLOR = "rgb(200, 0, 0)";

export const DANGER_SPEED = 40.0;

export const DANGER_SIZE = 16.0;

export const NUM_CRITTERS = 5;

export const CRITTER_COLOR = "rgb(100, 100, 200)";

export const CRITTER_SIZE = 10.0;

export const VISION_DISTANCE_LIMIT = 600.0;

export const VISION_ANGLE_LIMIT = (0.7 * Math.PI) / 2;

export const SCENT_DISTANCE_LIMIT = 250.0;

/* In viewbox pixels per second */
export const BASE_SPEED_FORWARD = 100.0;

/* In radian per second */
export const BASE_SPEED_ANGULAR = 0.2 * Math.PI;

/* Number of neurons with a rectifier activation function (ReLU) in the hidden layer.
 * Must be a multiple of four. */
export const GENOME_HIDDEN_RELU = 8;

/* All weights are between plus or minus this value. */
export const GENOME_WEIGHT_AMPLITUDE = 20.0;

/* Number of genomes in a generation */
export const POPULATION_SIZE = 200;

/* Number of selected genomes with top fitness score */
export const BEST_KEEP = 9;

/* Number of randomly-selected genomes */
export const RAND_KEEP = 48;

/* Number of novel randomly-generated genomes */
export const RAND_NEW = 6;

/* Weight of top fitness score genomes (i.e. how many time each is added to the pool) */
export const BEST_PRIORITY = 4;

/* Number of genomes with the lowest fitness score that are discarded */
export const WORST_DISCARD = 50;

export const SIM_TIME = 40; /* in seconds */

export const TIME_STEP = 200; /* in milliseconds */

/* Fitness score: number of points gained each time food is captured */
export const FOOD_COST = 1.0;

/* Fitness score: number of points gained (negative for loss) each time the critter is captured */
export const DANGER_COST = -50.0;

export const FIRST_UPDATE = 2.0; /* In seconds */

export const UPDATE_INTERVAL = 20.0; /* In seconds */

export const LOG_INTERVAL = 50; /* In generations */
