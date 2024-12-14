#!/usr/bin/env bash -c make

SRC=./int64-buffer.js
TESTS=./test/*.js
DIST=./dist
JSDEST=./dist/int64-buffer.min.js
JSGZIP=./dist/int64-buffer.min.js.gz

all: $(JSGZIP)

clean:
	rm -fr $(JSDEST) $(JSGZIP)

$(DIST):
	mkdir -p $@

$(JSDEST): $(SRC) $(DIST)
	./node_modules/.bin/terser $< -c -m -o $@

$(JSGZIP): $(JSDEST)
	gzip -9 < $^ > $@
	ls -l $^ $@

test: all jshint mocha

test-coverage:
	./node_modules/.bin/nyc make mocha
	./node_modules/.bin/nyc report --reporter=text-lcov > .nyc_output/lcov.info

mocha:
	./node_modules/.bin/mocha -R spec $(TESTS)

jshint:
	./node_modules/.bin/jshint .

.PHONY: all clean test jshint mocha
