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

function createScene(w, h) {
    const millisPerSecond = 1000;
    var things = new Array(NUM_FOOD + NUM_DANGER)
    var critters = [];
    
    for(var idx = 0; idx < things.length; ++idx) {
        if(idx < NUM_FOOD) {
            things[idx] = createFood(w, h)
        }
        else {
            things[idx] = createDanger(w, h)
        }
    }
    
    return {
        lastUpdate : performance.now(),
        
        addCritter : function(critter) {
            critters.push(critter);            
        },
        
        harvestCritter : function() {
            return critters.shift();
        },
        
        updateScene : function() {
            var now = performance.now();
            
            this.updatePosition((now - this.lastUpdate) / millisPerSecond);
            
            this.lastUpdate = performance.now();
        },
        
        updatePosition : function(timeDelta) {
            for(const thing of things) {
                thing.updatePosition(timeDelta)
            }
        },
        
        createSvg : function (svg) {
            for(const thing of things) {
                thing.createSvg(svg);
            }
            for(const critter of critters) {
                critter.createSvg(svg);
            }
        },
        
        renderSvg: function(offsetX, offsetY) {
            for(const thing of things) {
                thing.renderSvg(offsetX, offsetY);
            }
            for(const critter of critters) {
                critter.renderSvg(offsetX, offsetY);
            }
        }
    }
}
