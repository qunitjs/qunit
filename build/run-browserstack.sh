#!/bin/bash

for run in \
	"./build/browserstack-current-1.json" \
	"./build/browserstack-current-2.json" \
	"./build/browserstack-legacy-1.json" \
	"./build/browserstack-legacy-2.json"
do
	export BROWSERSTACK_JSON=$run
	node_modules/.bin/browserstack-runner
done
