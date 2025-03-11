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

import { DANGER_COLOR, DANGER_SIZE, DANGER_SPEED, FOOD_COLOR, FOOD_SIZE, FOOD_SPEED } from "./config";
import { svgCircle, svgRectangle } from "./main";

function createBoing(speed, w, h) {
    var rand = Math.random();
    
    if(rand < 0.25) {
        var goLeft = false;
        var goDown = false;
    }
    else if(rand < 0.5) {
        var goLeft = false;
        var goDown = true;
    }
    else if(rand < 0.75) {
        var goLeft = true;
        var goDown = false;
    }
    else {
        var goLeft = true;
        var goDown = true;
    }
    
    return {
        speedMult : speed * Math.SQRT1_2,
        x : w * Math.random(),
        y : h * Math.random(),
        goLeft : goLeft,
        goDown : goDown,
        
        updatePosition : function(timeDelta) {
            var deltaXY = timeDelta * this.speedMult;
            
            if(this.goLeft) {
                this.x += deltaXY;
            }
            else {
                this.x -= deltaXY;
            }
            
            if(this.goDown) {
                this.y += deltaXY;
            }
            else {
                this.y -= deltaXY;
            }
            
            if(this.x >= w) {
                this.x = w - 1.0;
                this.goLeft = false;
            }
            else if(this.x < 0) {
                this.x = 0;
                this.goLeft = true;
            }
            
            if(this.y >= h) {
                this.y = h - 1.0;
                this.goDown = false;
            }
            else if(this.y < 0) {
                this.y = 0;
                this.goDown = true;
            }
        },
        
        setPosition : function(x, y) {
            this.x = x;
            this.y = y;
        }
    }
}

export const thingKind = {
    FOOD : 1,
    DANGER : 2
}

export function createFood(w: number, h: number) {
    var boing = createBoing(FOOD_SPEED, w, h);
        
    return {
        circle: undefined as any,

        updatePosition : function(timeDelta) {
            boing.updatePosition(timeDelta)
        },
        
        createSvg : function (svg) {
            this.circle = svgCircle(svg, boing.x, boing.y, FOOD_SIZE);
            this.circle.setAttribute('fill', FOOD_COLOR);
        },
        
        renderSvg : function(offsetX, offsetY) {
            this.circle.setAttribute('cx', boing.x + offsetX);
            this.circle.setAttribute('cy', boing.y + offsetY);
        },
        
        getKind : function() {
            return thingKind.FOOD
        },
        
        getX : function() {
            return boing.x
        },
        
        getY : function() {
            return boing.y
        },
        
        setPosition : function(x, y) {
            boing.setPosition(x, y)
        }
    }
}

export function createDanger(w, h) {
    var boing = createBoing(DANGER_SPEED, w, h);
    
    function getTransform(x, y) {
        return 'translate(' + x + ',' + y + ') rotate(45)'
    }
        
    return {
        rect: undefined as any,

        updatePosition : function(timeDelta) {
            boing.updatePosition(timeDelta)
        },
        
        createSvg : function (svg) {
            this.rect = svgRectangle(
                svg,
                0 - DANGER_SIZE / 2,
                0 - DANGER_SIZE / 2,
                DANGER_SIZE * Math.SQRT1_2,
                DANGER_SIZE * Math.SQRT1_2);
                
            this.rect.setAttribute('fill', DANGER_COLOR);
        },
        
        renderSvg: function(offsetX, offsetY) {
            this.rect.setAttribute('transform', getTransform(
                boing.x + offsetX,
                boing.y + offsetY));
        },
        
        getKind : function() {
            return thingKind.DANGER
        },
        
        getX : function() {
            return boing.x
        },
        
        getY : function() {
            return boing.y
        },
        
        setPosition : function(x, y) {
            boing.setPosition(x, y)
        }
    }
}
