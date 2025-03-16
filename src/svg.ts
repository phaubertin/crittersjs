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

export class SvgCanvas {
    constructor(private readonly rootElement: SVGSVGElement) {}

    static create(parent: HTMLElement): SvgCanvas {
        const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        parent.appendChild(element);
        return new SvgCanvas(element);
    }

    setViewbox(width: number, height: number): void {
        this.rootElement.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    }

    addRectangle(x: number, y: number, w: number, h: number): SvgShape {
        const svgNS = this.rootElement.namespaceURI;
        const element = document.createElementNS(svgNS, 'rect');

        element.setAttribute('x', x.toString());
        element.setAttribute('y', y.toString());
        element.setAttribute('width', w.toString());
        element.setAttribute('height', h.toString());

        this.rootElement.appendChild(element);

        return new SvgShape(element);
    }

    addCircle(cx: number, cy: number, r: number): SvgShape {
        const svgNS = this.rootElement.namespaceURI;
        const element = document.createElementNS(svgNS, 'circle');

        element.setAttribute('cx', cx.toString());
        element.setAttribute('cy', cy.toString());
        element.setAttribute('r', r.toString());

        this.rootElement.appendChild(element);

        return new SvgShape(element);
    }
}

export class SvgShape {
    private translate: string;
    private rotate: string;

    constructor(private readonly element: Element) {
        this.translate = '';
        this.rotate = '';
    }

    setFillColor(color: string): void {
        this.element.setAttribute('fill', color);
    }

    setStrokeColor(color: string): void {
        this.element.setAttribute('stroke', color);
    }

    setTranslate(offsetX: number, offsetY: number): void {
        this.translate = `translate(${offsetX}, ${offsetY})`;
        this.updateTransform();
    }

    setRotate(angle: number): void {
        this.rotate = `rotate(${angle})`;
        this.updateTransform();
    }

    private updateTransform(): void {
        const transform = `${this.translate} ${this.rotate}`.trim();

        if (transform) {
            this.element.setAttribute('transform', transform);
        }
    }
}
