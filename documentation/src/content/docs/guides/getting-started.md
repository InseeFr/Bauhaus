---
title: Getting started
---

Bauhaus is a single page application built with [React](https://facebook.github.io/react/) and [Redux](https://github.com/reactjs/reduxreact). It was bootstraped with [Create React App](https://github.com/facebook/create-react-app) and designed thanks to [Bootstrap](https://github.com/twbs/bootstrap). To run the application in development mode, run the following commands from a shell prompt in the local directory, and then navigate to [http://localhost:3000](http://localhost:3000):

```shell
# Download all the dependencies needed by the application
yarn install
# Compiles the code and starts a minimal web server
yarn start
```

We discovered an error when using the command `yarn start` with a path containing accentuated characters. If this is also the case for you, you can also usr the command `npm start` instead of `yarn start`.

Application needs externals Web services : Bauhaus-Back-Office(https://github.com/InseeFr/Bauhaus-Back-Office).

## Test

`yarn test` runs the test watcher in an interactive mode. By default, runs tests related to files changed since the last commit.
An other script, `yarn test:coverage` allows to generate a complete local report `Bauhaus/coverage/lcov-report/index.html`.

Some Integrations tests are also available thanks to _Cypress.io_. You should use the `yarn cypress:open` command if you want to launch these tests on dev mode. For your CI, you have to use the `yarn cypress:run` command.

Unit tests are launched each time a `git push` is executed.

## Build

To build the application, run `yarn build`. You can now serve the content of the `dist` folder with the HTTP server of your choice.

For the deployment needs at INSEE, the CI will need to use the yarn build command. This command will also create an archive (zip) containing the project in order to deploy it.

### Docker

You can also build a Docker container :

```shell
docker build . -t bauhaus-front
```

And run it :

```shell
docker run  -it -p 8083:8080 -e VITE_API_BASE_HOST=http://192.168.1.12:8081/api bauhaus-front
```

`http://192.168.1.12:8081/api` is the base URL of the Bauhaus API.

## New to JavaScript and Node.js

If you're new to JavaScript, you might need to first install [node](https://nodejs.org/en/download/) and [yarn](https://github.com/yarnpkg/yarn) on your computer.

`yarn` is the `Node.js` package manager. `yarn install` will download all the dependencies needed by the project, as described in the `dependencies` and `devDepedencies` sections of the [package.json](https://github.com/InseeFr/Bauhaus/blob/main/package.json) file.

`yarn start` will launch the `dev` command defined in the `scripts` section of the same `package.json` file. This command will launch a local web server serving the main HTML file ([src/js/index.html](https://github.com/InseeFr/Bauhaus/blob/main/public/index.html)) and all the relevant assets.

`yarn build` will launch the compilation with some optimizations for production. It copies all the static assets and the resulting bundle file in the `dist` folder.

## Project Structure

In this paragraph, we will try to explain the rules we defined and try to follow when talking about the structure of the project.

### I18N

In order to avoid big i18n file, we try to split this file in smaller files, based on `page` or `feature`. For example, we have a `src/js/i18n/dictionary/operations/documents.js` file for all messages dedicated to the documents feature.
This files have to be imported directly or not in the main file `js/i18n/dictionary/app.js`.

### Form Validation

For validating data defined in a form, we recommend using the open-source library **zod**.
