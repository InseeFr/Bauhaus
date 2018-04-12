#!/usr/bin/env bash

set -e

DOC_FOLDER="built-storybook"
MAIN_BRANCH="master"
UPSTREAM="https://$GITHUB_TOKEN@github.com/$TRAVIS_REPO_SLUG.git"
MESSAGE="Rebuild storybook for revision $TRAVIS_COMMIT: $TRAVIS_COMMIT_MESSAGE"
AUTHOR="$USER <>"

if [ "$TRAVIS_PULL_REQUEST" != "false" ];then
  echo "Storybook won't build on pull request"
  exit 0
fi

if [ "$TRAVIS_BRANCH" != "$MAIN_BRANCH" ];then
  echo "Storybook won't build: Not on branch $MAIN_BRANCH"
  exit 0
fi

function publish() {
  pushd "$DOC_FOLDER"
  git init
  git remote add upstream "$UPSTREAM"
  git fetch --prune upstream
  git add --all .
  if git commit --message "$MESSAGE" --author "$AUTHOR" ; then
    git push --quiet upstream gh-pages
  fi
  popd
}

publish
