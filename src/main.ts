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
    BACKGROUND_COLOR,
    BORDER_COLOR,
    SCENE_BORDER,
    SCENE_COLOR,
    SCENE_HEIGHT,
    SCENE_MARGIN,
    SCENE_WIDTH,
} from './config';
import { Genome } from './genome';
import { Logger, MainLogger } from './logging';
import { deserializeMessage, MessageType } from './message';
import { createScene } from './scene';
import { SvgCanvas } from './svg';

const BACKGROUND_WIDTH = SCENE_WIDTH + 2 * SCENE_MARGIN;

const BACKGROUND_HEIGHT = SCENE_HEIGHT + 2 * SCENE_MARGIN;

/*  +--------------------------------------------------------------------------+
 *  |//////////////////////////////////////////////////////////////////////////|
 *  |//+--------------------------------------------------------------------+//|
 *  |//|////////////////////////////////////////////////////////////////////|//|
 *  |//|//+--------------------------------------------------------------+//|//|
 *  |//|//|                                                              |//|//|
 *  |//|//|                           Scene                              |//|//|
 *  |//|//|                                                              |//|//|
 *  |//|//+--------------------------------------------------------------+//|//|
 *  |//|/////////////////////////////////////////////////Border/////////////|//|
 *  |//+--------------------------------------------------------------------+//|
 *  |////////////////////////////////////////////////////Background////////////|
 *  +--------------------------------------------------------------------------+
 *
 * */

function createBackground(svg: SvgCanvas) {
    const background = svg.addRectangle(0, 0, BACKGROUND_WIDTH, BACKGROUND_HEIGHT);
    background.setFillColor(BACKGROUND_COLOR);

    const border = svg.addRectangle(
        SCENE_BORDER,
        SCENE_BORDER,
        SCENE_WIDTH + 2 * SCENE_BORDER,
        SCENE_HEIGHT + 2 * SCENE_BORDER,
    );
    border.setStrokeColor(BORDER_COLOR);

    const scene = svg.addRectangle(SCENE_MARGIN, SCENE_MARGIN, SCENE_WIDTH, SCENE_HEIGHT);
    scene.setFillColor(SCENE_COLOR);
}

function updateSceneCritters(scene, genomes: Genome[], logger: Logger) {
    let idx = 0;

    logger.log('Updating scene.');

    for (let genome of genomes) {
        if (idx < scene.critters.length) {
            scene.critters[idx].genome = genome;
        } else {
            break;
        }
        ++idx;
    }
}

function handleWorkerMessage(
    scene,
    mainLogger: Logger,
    workerLogger: Logger,
    e: MessageEvent<string>,
) {
    const message = deserializeMessage(e.data);

    console.log(message);

    switch (message.type) {
        case MessageType.updateGenome:
            updateSceneCritters(scene, message.genomes, mainLogger);
            break;
        case MessageType.logStatus:
            workerLogger.log(message.status);
            break;
    }
}

function createWorker(scene, mainLogger: Logger, workerLogger: Logger) {
    mainLogger.log('Starting worker.');

    var worker = new Worker('critters-worker.js');

    worker.onmessage = function (e) {
        handleWorkerMessage(scene, mainLogger, workerLogger, e);
    };
}

export function loadCritters(renderID, logID) {
    let renderParent = document.getElementById(renderID);

    if (!renderParent) {
        console.error(`No '${renderID}' element (rendering parent)`);
        return;
    }

    const logParent = document.getElementById(logID);

    if (!logParent) {
        console.error(`No '${logID}' element (logging parent)`);
        return;
    }

    const svg = SvgCanvas.create(renderParent);
    svg.setViewbox(BACKGROUND_WIDTH, BACKGROUND_HEIGHT);

    createBackground(svg);
    const scene = createScene(SCENE_WIDTH, SCENE_HEIGHT, true);

    scene.createSvg(svg);

    window.setInterval(function () {
        scene.updateScene();
        scene.renderSvg(SCENE_MARGIN, SCENE_MARGIN);
    }, 20);

    const mainLogger = new MainLogger(logParent, 'main');
    const workerLogger = new MainLogger(logParent, 'worker');

    createWorker(scene, mainLogger, workerLogger);
}
