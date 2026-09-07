#!/usr/bin/env bash

set -e

DOC_FOLDER="documentation"
SITE_FOLDER="website"
STORYBOOK_FOLDER="storybook-static"

function publish() {
  echo "Start Publishing"

  if [ -d "$SITE_FOLDER" ]; then rm -Rf $SITE_FOLDER; fi

  mkdir $SITE_FOLDER
  pushd "$SITE_FOLDER"

  cp -a "../$DOC_FOLDER/dist/." .

  # Storybook est publié à côté de la documentation, sous /storybook/
  if [ -d "../$STORYBOOK_FOLDER" ]; then
    mkdir storybook
    cp -a "../$STORYBOOK_FOLDER/." storybook/
  fi

  popd
}

function main() {
  echo "Building everything"
  publish
}

main

