#!/usr/bin/env bash

set -e

TEMP_FOLDER="temp"
UPSTREAM="https://$GITHUB_TOKEN@github.com/$TRAVIS_REPO_SLUG.git"
STORY_BOOK_FOLDER="storybook-static"
MESSAGE="Rebuild storybook for revision $TRAVIS_COMMIT: $TRAVIS_COMMIT_MESSAGE"
AUTHOR="$USER <>"

function build() {
  yarn build-storybook
}

function publish() {
  pushd "$TEMP_FOLDER"
  git init
  git remote add upstream "$UPSTREAM"
  git fetch --prune upstream
  git pull upstream/gh-pages cp "$STORY_BOOK_FOLDER" . -r
  git add --all .
  if git commit --message "$MESSAGE" --author "$AUTHOR" ; then
  git push --quiet upstream HEAD:gh-pages
  fi
  popd
}

function main() {
  build && publish
}

main
