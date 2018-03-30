#!/usr/bin/env bash

set -e

function main() {
  mv storybook-static storybook
  cp -r storybook docs/fr/
  cp -r storybook docs/en/
}

main
