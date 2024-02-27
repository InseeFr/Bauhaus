<img align="right" src="docs/img/bauhaus-logo.png" alt="Bauhaus logo"/>

# Bauhaus

Web application for the management of concepts, classifications and other statistical objects.

[![Trevas JS CI](https://github.com/InseeFr/Bauhaus/actions/workflows/ci.yml/badge.svg)](https://github.com/InseeFr/Bauhaus/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=InseeFr_Bauhaus&metric=alert_status)](https://sonarcloud.io/dashboard?id=InseeFr_Bauhaus)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=InseeFr_Bauhaus&metric=coverage)](https://sonarcloud.io/dashboard?id=InseeFr_Bauhaus)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

The documentation can be found in the [docs](https://github.com/InseeFr/Bauhaus/tree/main/docs) folder and [browsed online](https://inseefr.github.io/Bauhaus).

## How to start

The application is tested on Node.js 20.

```
git clone git@github.com:InseeFr/Bauhaus.git
cd Bauhaus
yarn
yarn build-insee
yarn start
```

You can run all tests suites for all modules with this command. You need to run at least once `yarn build-insee`.

```shell
yarn test:coverage
```

Or if you want to run tests for a specific module, you can run one of the following commands. These commands will activate the `watch` mode, and you will be able to selecta a subset of tests you want to run.

```shell
yarn workspace Bauhaus run test --watchAll   
yarn workspace bauhaus-codelists run test --watchAll
yarn workspace bauhaus-operations run test --watchAll 
yarn workspace bauhaus-structures run test --watchAll 
yarn workspace bauhaus-utilities run test --watchAll 
```

## Docker

You can also run the application thanks to **Docker**

```shell
docker build --file Dockerfile.dev -t bauhaus:front .
docker run -it --rm -v ${PWD}:/app -v /app/node_modules -p 3000:3000 bauhaus:front
```

## Issues

If you are using, you should install the following dependency. 

```
yarn global add windows-build-tools

```
