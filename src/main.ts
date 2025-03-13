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

import { WORKER_FILE_NAME } from './config';
import { Genome } from './genome';
import { Logger, MainLogger } from './logging';
import { deserializeMessage, MessageType } from './message';
import { Scene } from './scene';
import { SvgCanvas } from './svg';

export class CrittersApplication {
    constructor(
        private readonly scene: Scene,
        private readonly svg: SvgCanvas,
        private readonly mainLogger: Logger,
        private readonly workerLogger: Logger,
    ) {}

    start(): void {
        this.scene.createSvg(this.svg);
        this.startPeriodic();
        this.startWorker();
    }

    private startWorker(): void {
        this.mainLogger.log('Starting worker.');

        const worker = new Worker(WORKER_FILE_NAME);

        worker.onmessage = this.handleWorkerMessageEvent.bind(this);
    }

    private startPeriodic(): void {
        window.setInterval(this.handlePeriodic.bind(this), 20);
    }

    private handlePeriodic(): void {
        this.scene.updateScene();
        this.scene.renderSvg();
    }

    private handleWorkerMessageEvent(e: MessageEvent<string>): void {
        const message = deserializeMessage(e.data);

        switch (message.type) {
            case MessageType.updateGenome:
                this.updateSceneCritters(message.genomes);
                break;
            case MessageType.logStatus:
                this.workerLogger.log(message.status);
                break;
        }
    }

    private updateSceneCritters(genomes: Genome[]): void {
        this.mainLogger.log('Updating scene.');

        let index = 0;

        for (let genome of genomes) {
            const critter = this.scene.getCritter(index);

            if (!critter) {
                break;
            }

            critter.setGenome(genome);

            ++index;
        }
    }
}

export function loadCritters(renderID, logID) {
    const renderParent = document.getElementById(renderID);
    const logParent = document.getElementById(logID);

    if (!(renderParent && logParent)) {
        if (!renderParent) {
            console.error(`No '${renderID}' element (rendering parent)`);
        }

        if (!logParent) {
            console.error(`No '${logID}' element (logging parent)`);
        }

        return;
    }

    const application = new CrittersApplication(
        new Scene(true),
        SvgCanvas.create(renderParent),
        new MainLogger(logParent, 'main'),
        new MainLogger(logParent, 'worker'),
    );

    application.start();
}
