#!/usr/bin/env bash

set -e

function main() {
  cp -r storybook-static docs/fr/storybook
  cp -r storybook-static docs/en/storybook
}

main
