#!/usr/bin/env bash

set -e

DOC_FOLDER="docs"
STORYBOOK_FOLDER="built-storybook"
SITE_FOLDER="website"


function setup() {
  echo "Installing Yarn and gitbook-cli"
  npm install -g yarn gitbook-cli
}

function buildDocumentation() {
  echo "Running gitbook install and build"
  pushd "$DOC_FOLDER"
  gitbook install
  gitbook build
  popd
}


function publish() {
  echo "Start Publishing"

  if [ -d "$SITE_FOLDER" ]; then rm -Rf $SITE_FOLDER; fi

  mkdir $SITE_FOLDER
  pushd "$SITE_FOLDER"

  cp -a "../$DOC_FOLDER/_book/." .

  popd
}

function main() {
  echo "Building everything"
  setup && buildDocumentation && publish
}

main

