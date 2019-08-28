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
 
const BACKGROUND_WIDTH = SCENE_WIDTH + 2 * SCENE_MARGIN;
 
const BACKGROUND_HEIGHT = SCENE_HEIGHT + 2 * SCENE_MARGIN;

function svgRectangle(svg, x, y, w, h) {
    var svgNS = svg.namespaceURI;
    var rect = document.createElementNS(svgNS,'rect');
    
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', w);
    rect.setAttribute('height', h);
    
    svg.appendChild(rect);
    
    return rect
}

function svgCircle(svg, cx, cy, r) {
    var svgNS = svg.namespaceURI;
    var circle = document.createElementNS(svgNS,'circle');
    
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    
    svg.appendChild(circle);
    
    return circle
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
    background.setAttribute('fill', BACKGROUND_COLOR);
    
    var border = svgRectangle(
        svg,
        SCENE_BORDER,
        SCENE_BORDER,
        SCENE_WIDTH + 2 * SCENE_BORDER,
        SCENE_HEIGHT + 2 * SCENE_BORDER);
    border.setAttribute('stroke', BORDER_COLOR);
    
    var scene = svgRectangle(
        svg,
        SCENE_MARGIN,
        SCENE_MARGIN,
        SCENE_WIDTH,
        SCENE_HEIGHT);
    scene.setAttribute('fill', SCENE_COLOR);
}

function setViewbox(svg) {
    svg.setAttribute('viewBox', '0 0 ' + BACKGROUND_WIDTH + ' ' + BACKGROUND_HEIGHT);
}

function loadCritters(parentID) {
    var parent  = document.getElementById(parentID);
    var svg     = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    setViewbox(svg)
    parent.appendChild(svg);
    
    createBackground(svg)
    scene = createScene(SCENE_WIDTH, SCENE_HEIGHT, true);
        
    scene.createSvg(svg)
    
    window.setInterval(
        function() {
            scene.updateScene();
            scene.renderSvg(SCENE_MARGIN, SCENE_MARGIN);
        }, 20);
}
