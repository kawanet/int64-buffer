# Force bash so `set -o pipefail` works in the recipes below.
SHELL := bash
.SHELLFLAGS := -eo pipefail -c

PLAYWRIGHT_VERSION := 1.62.1

all: dist bundled

bundled:
    @: # NOP

# Keep Playwright out of package.json. CI installs it transiently alongside
# the project's build dependencies, then downloads only the headless shell.
install:
	cd .. && PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install playwright@$(PLAYWRIGHT_VERSION) --no-save --ignore-scripts --no-audit --no-fund
	cd .. && npx --no-install playwright install --with-deps --only-shell chromium

# tests.html loads the shipped bundle, so ask the root Makefile for it
# first; whether it rebuilds stays the root Makefile's decision.
dist:
	$(MAKE) -C .. dist/int64-buffer.min.js

test: all
	cd .. && node browser/tests.cli.mjs

clean:
    @: # NOP

.PHONY: all bundled install test clean
