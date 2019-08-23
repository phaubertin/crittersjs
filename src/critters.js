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

function createWindow(svg) {
    var background = svgRectangle(svg, 0, 0, SCENE_WIDTH, SCENE_HEIGHT);
    background.setAttribute('fill', BACKGROUND_COLOR);
    
    var border = svgRectangle(
        svg,
        SCENE_BORDER,
        SCENE_BORDER,
        SCENE_WIDTH - 2 * SCENE_BORDER,
        SCENE_HEIGHT - 2 * SCENE_BORDER);
    border.setAttribute('stroke', BORDER_COLOR);
    
    var scene = svgRectangle(
        svg,
        SCENE_MARGIN,
        SCENE_MARGIN,
        SCENE_WIDTH - 2 * SCENE_MARGIN,
        SCENE_HEIGHT - 2 * SCENE_MARGIN);
    scene.setAttribute('fill', SCENE_COLOR);
}

function loadCritters(parentID) {
    var parent  = document.getElementById(parentID);
    var svg     = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    
    svg.setAttribute('viewBox', '0 0 ' + SCENE_WIDTH + ' ' + SCENE_HEIGHT);
    parent.appendChild(svg);
    
    createWindow(svg)
}
