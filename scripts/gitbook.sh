#!/usr/bin/env bash

set -e

DOC_FOLDER="docs"
STORYBOOK_FOLDER="built-storybook"
SITE_FOLDER="website"

MAIN_BRANCH="master"
UPSTREAM="https://$GITHUB_TOKEN@github.com/InseeFr/Bauhaus.git"
MESSAGE="Rebuild doc for revision"
AUTHOR="$USER <>"

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

function buildStoryBook(){
  echo "Building storybook"
  yarn build-storybook
}

function publish() {
  echo "Start Publishing"

  if [ -d "$SITE_FOLDER" ]; then rm -Rf $SITE_FOLDER; fi

  mkdir $SITE_FOLDER
  pushd "$SITE_FOLDER"

  cp -a "../$DOC_FOLDER/_book/." .


  mkdir storybook
  mkdir storybook/app

  cp -R "../app/$STORYBOOK_FOLDER/storybook/." storybook/app

  git init
  git remote add upstream "$UPSTREAM"
  git fetch --prune upstream
  git reset upstream/gh-pages
  git add --all .
  if git commit --message "$MESSAGE" --author "$AUTHOR" ; then
    git push --quiet upstream HEAD:gh-pages
  fi
  popd
}

function main() {
  echo "Building everything"
  setup && buildDocumentation && buildStoryBook && publish
}

main

