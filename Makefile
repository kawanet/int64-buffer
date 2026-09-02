#!/usr/bin/env bash -c make

SRC=./int64-buffer.js
JSTEST=./test/test.js
DIST=./dist
JSDEST=./dist/int64-buffer.min.js
JSGZIP=./dist/int64-buffer.min.js.gz
ESMDEST=./int64-buffer.mjs
ESMTEST=./test/test.mjs

# Documented runtime named exports that must be verified in every bundle.
NAMED_EXPORTS := Int64BE Uint64BE Int64LE Uint64LE

####

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

test: all jshint smoke mocha

test-coverage:
	./node_modules/.bin/nyc make mocha
	./node_modules/.bin/nyc report --reporter=text-lcov > .nyc_output/lcov.info

mocha: $(JSTEST) $(ESMTEST)
	./node_modules/.bin/mocha -R spec $(JSTEST)
	./node_modules/.bin/mocha -R spec $(ESMTEST)

jshint:
	./node_modules/.bin/jshint . --extra-ext .json

#### ES Module

$(ESMDEST): $(SRC) Makefile
	mkdir -p $(dir $@)
	perl -pe 's#^(var|.*export)#/// $$1#; s#^(\s*)(\S.*= )(factory.")#$$1export const $$2/* \@__PURE__ */ $$3#' < $< > $@

$(ESMTEST): $(JSTEST) Makefile
	mkdir -p $(dir $@)
	perl -pe 's#^(var exported)#/// $$1#; s#^.*#import * as exported from "../int64-buffer.mjs";# if $$. == 1' < $< > $@

####

# Verify the bundles by importing/requiring the package itself.
smoke: smoke-mjs smoke-cjs smoke-minjs

# MJS smoke test via public entrypoint.
smoke-mjs: $(ESMDEST)
	node --input-type=module -e 'const m = await import("int64-buffer"), a = process.argv.slice(1), f = a.filter(k => typeof m[k] !== "function"), e = f.length; console.error("ESM export:", (e ? f : a).join(", "), e ? "missing" : ""); process.exit(e)' $(NAMED_EXPORTS)

# CJS smoke test via public entrypoint.
smoke-cjs: $(SRC)
	node --input-type=commonjs -e 'const m = require("int64-buffer"), a = process.argv.slice(1), f = a.filter(k => typeof m[k] !== "function"), e = f.length; console.error("CJS export:", (e ? f : a).join(", "), e ? "missing" : ""); process.exit(e)' $(NAMED_EXPORTS)

# Smoke the .min.js in two consumer shapes: browser IIFE and CJS require()
smoke-minjs: $(JSDEST)
	(cat $< && echo '; const a = process.argv.slice(2), f = a.filter(k => typeof eval(k) !== "function"), e = f.length; console.error(".min.js IIFE export:", (e ? f : a).join(", "), e ? "missing" : ""); process.exit(e)') | node - $(NAMED_EXPORTS)
	node --input-type=commonjs -e 'const m = require("./dist/int64-buffer.min.js"), a = process.argv.slice(1), f = a.filter(k => typeof m[k] !== "function"), e = f.length; console.error(".min.js CJS export:", (e ? f : a).join(", "), e ? "missing" : ""); process.exit(e)' $(NAMED_EXPORTS)

####

.PHONY: all clean test jshint mocha smoke
