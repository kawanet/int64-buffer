# Force bash so `set -o pipefail` works in the recipes below.
SHELL := bash
.SHELLFLAGS := -eo pipefail -c

all: dist bundled

bundled:
	@: # NOP

install:
	cd .. && node ./node_modules/.bin/playwright install chromium --only-shell --with-deps

dist:
	$(MAKE) -C .. dist/int64-buffer.min.js

../test/test.mjs:
	$(MAKE) -C .. test/test.mjs

test: all ../test/test.mjs
	cd .. && node ./node_modules/.bin/chromium-js \
	--script dist/int64-buffer.min.js \
	--alias int64-buffer=browser/import.mjs \
	--test test/test.mjs

clean:
    @: # NOP

.PHONY: all bundled install test clean
