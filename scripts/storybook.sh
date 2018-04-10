#!/usr/bin/env bash

set -e

STORY_BOOK_FOLDER="storybook-static"
UPSTREAM="https://$GITHUB_TOKEN@github.com/$TRAVIS_REPO_SLUG.git"
MESSAGE="Rebuild storybook for revision $TRAVIS_COMMIT: $TRAVIS_COMMIT_MESSAGE"
AUTHOR="$USER <>"

function build() {
  yarn build-storybook
}

function publish() {
  git init
  git remote add upstream "$UPSTREAM"
  git fetch --prune upstream
  git pull upstream/gh-pages cp -r ./"$STORY_BOOK_FOLDER".
  git add --all .
  if git commit --message "$MESSAGE" --author "$AUTHOR" ; then
  git push --quiet upstream HEAD:gh-pages
  fi
}

function main() {
  build && publish
}

main
