#!/usr/bin/env bash

set -e

DOC_FOLDER="documentation"
SITE_FOLDER="website"

function buildDocumentation() {
  echo "Running gitbook install and build"
  pushd "$DOC_FOLDER"
  npm i
  npm build
  popd
}


function publish() {
  echo "Start Publishing"

  if [ -d "$SITE_FOLDER" ]; then rm -Rf $SITE_FOLDER; fi

  mkdir $SITE_FOLDER
  pushd "$SITE_FOLDER"

  cp -a "../$DOC_FOLDER/dist/." .

  popd
}

function main() {
  echo "Building everything"
  buildDocumentation && publish
}

main

