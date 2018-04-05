#!/usr/bin/env bash

set -e

function build() {
  yarn build-storybook
}

function publish() {
  git fetch
  git checkout gh-pages
  git checkout master -- storybook-static
  git add .
  git commit -m "Deploy Storybook to GitHub Pages"
  git push
  git checkout master
  git rm -rf storybook-static
  git commit -m "Delete storybook-static from master"
  git push
}

function main() {
  build && publish
}

main
