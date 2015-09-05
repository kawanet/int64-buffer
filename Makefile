#!/usr/bin/env bash -c make

SRC=./int64-buffer.js
TESTS=./test/*.js
HINTS=$(SRC) $(TESTS)
DIST=./dist
JSDEST=./dist/int64-buffer.min.js

all: test $(JSDEST)

clean:
	rm -fr $(JSDEST)

$(DIST):
	mkdir -p $(DIST)

$(JSDEST): $(DIST)
	./node_modules/.bin/uglifyjs $(SRC) -c -m -o $(JSDEST)
	ls -l $(JSDEST)

test: jshint mocha

mocha:
	./node_modules/.bin/mocha -R spec $(TESTS)

jshint:
	./node_modules/.bin/jshint $(HINTS)

.PHONY: all clean test jshint mocha
