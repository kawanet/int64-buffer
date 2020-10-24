#!/usr/bin/env bash -c make

SRC=./int64-buffer.js
TESTS=*.json ./test/*.js
HINTS=$(SRC) $(TESTS)
DIST=./dist
JSDEST=./dist/int64-buffer.min.js
JSGZIP=./dist/int64-buffer.min.js.gz

all: test $(JSGZIP)

clean:
	rm -fr $(JSDEST) $(JSGZIP)

$(DIST):
	mkdir -p $@

$(JSDEST): $(SRC) $(DIST)
	./node_modules/.bin/terser $< -c -m -o $@

$(JSGZIP): $(JSDEST)
	gzip -9 < $^ > $@
	ls -l $^ $@

test:
	@if [ "x$(BROWSER)" = "x" ]; then make test-node; else make test-browser; fi

test-node: jshint mocha

mocha:
	./node_modules/.bin/mocha -R spec $(TESTS)

jshint:
	./node_modules/.bin/jshint $(HINTS)

.PHONY: all clean test jshint mocha
