#!/usr/bin/env bash

set -e

DOC_FOLDER="documentation"
SITE_FOLDER="website"

function buildDocumentation() {
  echo "Running gitbook install and build"
  pushd "$DOC_FOLDER"
  yarn
  yarn build
  popd
}

function main() {
  echo "Building everything"
  buildDocumentation
}

main

