# Getting started

Bauhaus is a single page application built with [React](https://facebook.github.io/react/) and [Redux](https://github.com/reactjs/reduxreact). It was bootstraped with [Create React App](https://github.com/facebook/create-react-app) and designed thanks to [Bootstrap](https://github.com/twbs/bootstrap). To run the application in development mode, run the following commands from a shell prompt in the local directory, and then navigate to [http://localhost:3000](http://localhost:3000):

```
# Download all the dependencies needed by the application
yarn install
# Compiles the code and starts a minimal web server
yarn start
```

Application needs externals Web services : Bauhaus-Back-Office(https://github.com/InseeFr/Bauhaus-Back-Office).

## Test

`yarn test` runs the test watcher in an interactive mode. By default, runs tests related to files changed since the last commit.
An other script, `yarn test:coverage` allows to generate a complete local report `Bauhaus/coverage/lcov-report/index.html`.

## Build

To build the application, run `yarn build`. You can now serve the content of the `dist` folder with the HTTP server of your choice.

## New to JavaScript and Node.js

If you're new to JavaScript, you might need to first install [node](https://nodejs.org/en/download/) and [yarn](https://github.com/yarnpkg/yarn) on your computer.

`yarn` is the `Node.js` package manager. `yarn install` will download all the dependencies needed by the project, as described in the `dependencies` and `devDepedencies` sections of the [package.json](https://github.com/InseeFr/Bauhaus/blob/master/package.json) file.

`yarn start` will launch the `dev` command defined in the `scripts` section of the same `package.json` file. This command will launch a local web server serving the main HTML file ([src/js/index.html](https://github.com/InseeFr/Bauhaus/blob/master/src/index.html)) and all the relevant assets.

`yarn build` will launch the compilation with some optimizations for production. It copies all the static assets and the resulting bundle file in the `dist` folder.
