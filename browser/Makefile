# Force bash so `set -o pipefail` works in the recipes below.
SHELL := bash
.SHELLFLAGS := -eo pipefail -c

# CI sets CDP_PORT to attach to a running Chrome over CDP instead of installing one.
PLAYWRIGHT_CONFIG := tests/playwright-config-$(or $(CDP_PORT),default).json

ALL := $(PLAYWRIGHT_CONFIG)

all: dist bundled $(ALL)

bundled:
	@: # NOP

install:
	if [ -z "$(CDP_PORT)" ]; then \
		cd .. && node ./node_modules/.bin/playwright install chromium --only-shell --with-deps; \
	fi

dist:
	$(MAKE) -C .. dist/int64-buffer.min.js

../test/test.mjs:
	$(MAKE) -C .. test/test.mjs

test: all install ../test/test.mjs
	cd .. && node ./node_modules/.bin/chromium-js \
	--playwright-config browser/$(PLAYWRIGHT_CONFIG) \
	--script dist/int64-buffer.min.js \
	--alias int64-buffer=browser/import.mjs \
	--test test/test.mjs

$(PLAYWRIGHT_CONFIG): Makefile
	mkdir -p $(dir $@)
	if [ -n "$(CDP_PORT)" ]; then \
		echo '{"connectOverCDP": "http://127.0.0.1:$(CDP_PORT)"}' > $@; \
	else \
		echo '{}' > $@; \
	fi

clean:
	/bin/rm -fr tests $(ALL)

.PHONY: all bundled install test clean
