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
} from "./config";
import { getMessagePayload, messageType } from "./message";
import { createScene } from "./scene";

const BACKGROUND_WIDTH = SCENE_WIDTH + 2 * SCENE_MARGIN;

const BACKGROUND_HEIGHT = SCENE_HEIGHT + 2 * SCENE_MARGIN;

var logParent;

export function svgRectangle(svg, x, y, w, h) {
    var svgNS = svg.namespaceURI;
    var rect = document.createElementNS(svgNS, "rect");

    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", w);
    rect.setAttribute("height", h);

    svg.appendChild(rect);

    return rect;
}

export function svgCircle(svg, cx, cy, r) {
    var svgNS = svg.namespaceURI;
    var circle = document.createElementNS(svgNS, "circle");

    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", r);

    svg.appendChild(circle);

    return circle;
}

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

function createBackground(svg) {
    var background = svgRectangle(svg, 0, 0, BACKGROUND_WIDTH, BACKGROUND_HEIGHT);
    background.setAttribute("fill", BACKGROUND_COLOR);

    var border = svgRectangle(
        svg,
        SCENE_BORDER,
        SCENE_BORDER,
        SCENE_WIDTH + 2 * SCENE_BORDER,
        SCENE_HEIGHT + 2 * SCENE_BORDER,
    );
    border.setAttribute("stroke", BORDER_COLOR);

    var scene = svgRectangle(svg, SCENE_MARGIN, SCENE_MARGIN, SCENE_WIDTH, SCENE_HEIGHT);
    scene.setAttribute("fill", SCENE_COLOR);
}

function setViewbox(svg) {
    svg.setAttribute("viewBox", "0 0 " + BACKGROUND_WIDTH + " " + BACKGROUND_HEIGHT);
}

function logStatus(origin, status) {
    console.log(origin + ": " + status);

    let span = document.createElement("span");
    span.appendChild(document.createTextNode(origin));
    span.className = "origin";

    let p = document.createElement("p");
    p.appendChild(span);
    p.appendChild(document.createTextNode(status));

    /* The logParent variable is global. */
    logParent.appendChild(p);
}

function logMain(status) {
    logStatus("main", status);
}

function updateSceneCritters(scene, genomes) {
    var idx = 0;

    logMain("Updating scene.");

    for (let genome of genomes) {
        if (idx < scene.critters.length) {
            scene.critters[idx].genome = genome;
        } else {
            break;
        }
        ++idx;
    }
}

function handleWorkerMessage(scene, e) {
    let message = e.data;
    let payload = getMessagePayload(message);

    switch (message.type) {
        case messageType.GENOME_UPDATE:
            updateSceneCritters(scene, payload);
            break;
        case messageType.LOG_STATUS:
            logStatus("worker", payload);
            break;
        default:
            console.warn("Unhandled message type: " + message.type);
    }
}

function createWorker(scene) {
    logMain("Starting worker.");

    var worker = new Worker("critters-worker.js");

    worker.onmessage = function (e) {
        handleWorkerMessage(scene, e);
    };
}

export function loadCritters(renderID, logID) {
    let renderParent = document.getElementById(renderID);

    if (!renderParent) {
        return;
    }

    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    setViewbox(svg);
    renderParent.appendChild(svg);

    /* This variable is global. */
    logParent = document.getElementById(logID);

    createBackground(svg);
    let scene = createScene(SCENE_WIDTH, SCENE_HEIGHT, true);

    scene.createSvg(svg);

    window.setInterval(function () {
        scene.updateScene();
        scene.renderSvg(SCENE_MARGIN, SCENE_MARGIN);
    }, 20);

    createWorker(scene);
}
