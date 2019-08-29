# Copyright (C) 2019 Philippe Aubertin.
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions
# are met:
# 1. Redistributions of source code must retain the above copyright
#    notice, this list of conditions and the following disclaimer.
# 2. Redistributions in binary form must reproduce the above copyright
#    notice, this list of conditions and the following disclaimer in the
#    documentation and/or other materials provided with the distribution.
# 3. Neither the name of the author nor the names of other contributors
#    may be used to endorse or promote products derived from this software
#    without specific prior written permission.
# 
# THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS "AS IS" AND
# ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
# WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
# DISCLAIMED. IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE FOR ANY
# DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
# (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
# LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
# ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
# SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

MAIN_SOURCES = \
	brain.js \
	config.js \
	critter.js \
	main.js \
	scene.js \
	thing.js

COPIED_HTML = \
	index.html \
	critters.css

SOURCE_PREFIX	= src/
HTML_PREFIX		= html/
TARGET_PREFIX	= target/

MAIN_TARGET		= ${TARGET_PREFIX}critters-main.js
SOURCE_TARGETS	= ${MAIN_TARGET}
COPIED_TARGETS	= $(addprefix ${TARGET_PREFIX},${COPIED_HTML})
TARGETS			= ${SOURCE_TARGETS} ${COPIED_TARGETS}

RUN_COMPILER	= closure/run-compiler

.PHONY: all
all: ${TARGETS}

.PHONY: clean
clean:
	-rm -f ${TARGETS}

${MAIN_TARGET}: $(addprefix ${SOURCE_PREFIX},${MAIN_SOURCES})
	${RUN_COMPILER} --js_output_file ${MAIN_TARGET} $(addprefix --js ,$^)

${COPIED_TARGETS}: $(addprefix ${HTML_PREFIX},${COPIED_HTML})
	cp $^ ${TARGET_PREFIX}
