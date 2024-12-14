#!/usr/bin/env bash -c make

SRC=./int64-buffer.js
JSTEST=./test/test.js
DIST=./dist
JSDEST=./dist/int64-buffer.min.js
JSGZIP=./dist/int64-buffer.min.js.gz
ESMDEST=./int64-buffer.mjs
ESMTEST=./test/test.mjs

all: $(JSGZIP) $(ESMDEST)

clean:
	rm -fr $(JSDEST) $(JSGZIP) $(ESMDEST) $(ESMTEST)

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

mocha: $(JSTEST) $(ESMTEST)
	./node_modules/.bin/mocha -R spec $(JSTEST)
	./node_modules/.bin/mocha -R spec $(ESMTEST)

jshint:
	./node_modules/.bin/jshint .

#### ES Module

$(ESMDEST): $(SRC) Makefile
	mkdir -p $(dir $@)
	perl -pe 's#^(var|.*export)#/// $$1#; s#^(\s*)(\S.*= )(factory.")#$$1export const $$2/* \@__PURE__ */ $$3#' < $< > $@

$(ESMTEST): $(JSTEST) Makefile
	mkdir -p $(dir $@)
	perl -pe 's#^(var exported)#/// $$1#; s#^.*#import * as exported from "../int64-buffer.mjs";# if $$. == 1' < $< > $@

####

.PHONY: all clean test jshint mocha esm
