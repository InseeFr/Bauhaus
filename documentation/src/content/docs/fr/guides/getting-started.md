---
title: Getting started
---

Bauhaus est une application Web monopage construite avec [React](https://facebook.github.io/react/) et [Redux](https://github.com/reactjs/reduxreact). Elle est packagée par [Create React App](https://github.com/facebook/create-react-app) et les styles proviennent de [Bootstrap](https://github.com/twbs/bootstrap). Pour lancer l'application en développement, vous pouvez exécuter les commandes suivantes à partir d'un terminal dans le dossier Bauhaus, et visualiser ensuite la page [http://localhost:3000](http://localhost:3000):

```
# Téléchargement des dépendances
yarn install
# Compilation du code et démarrage d'un serveur de développement
yarn start
```

Nous avons remarqué une erreur avec la commande `yarn start` lorsque des caractéres accentués sont présent dans le `path`. Si cela est votre cas, vous pouvez exécuter la commande `npm start` à la place de `yarn start`.

L'application s'appuie sur des Web services externes : Bauhaus-Back-Office(https://github.com/InseeFr/Bauhaus-Back-Office).

## Test

Les tests peuvent être lancés de façon interactive avec la commande `yarn test`. Par défaut, seuls les tests impliquant des fichiers modifiés depuis le dernier commit seront éxécutés.
Un script supplémentaire, `yarn test:coverage` permet de générer un rapport local complet `Bauhaus/coverage/lcov-report/index.html`.

Des tests d'intégrations, utilisant _Cypress.io_ peuvent être également lancés. Pour cela, vous pouvez lancer la commande `yarn cypress:open` en développement, ou `yarn cypress:run` sur votre système d'intégration continue.

Les tests unitaires sont exécutés lorsque nous faisons un `git push`

## Build

Pour produire la version de production, lancez la commande `yarn build`. Vous pouvez désormais servir le contenu du dossier `dist` avec le serveur web de votre choix.

Pour les besoins de déploiement à l'INSEE, la CI devra utiliser la commande `yarn build-insee`. Cette commande va également créer une archive (zip) content le projet afin de le déployer. 

### Docker

Vous pouvez également builder un container Docker :

```shell
docker build . -t bauhaus-front
```

Et l'éxecuter :

```shell
docker run  -it -p 8083:80 -e BAUHAUS_API_URL=http://192.168.1.12:8081/api bauhaus-front
```

`http://192.168.1.12:8081/api` est l'URL de base de l'API Bauhaus.

## Débuter avec JavaScript et Node.js

Si vous débutez avec ces technologies, vous aurez vraisemblablement besoin d'installer dans un premier temps sur votre ordinateur [node](https://nodejs.org/en/download/) et [yarn](https://github.com/yarnpkg/yarn).

`yarn` est un gestionnaire de modules pour `Node.js`. `yarn install` téléchargera toutes les dépendances du projet, décrites dans la section `dependencies` et `devDepedencies` du fichier [package.json](https://github.com/InseeFr/Bauhaus/blob/main/package.json).

`yarn start` démarre un serveur de développement qui sert la page d'accueil de l'application ([src/js/index.html](https://github.com/InseeFr/Bauhaus/blob/main/public/index.html)) et toutes les ressources nécessaires.

`yarn build` lance la compilation du code avec des optimisations pour la mise en production. Elle copie toutes les ressources statiques et le fichier `JavaScript` compilé dans le dossier `dist`.

## Structure du projet

Dans ce paragraphe, nous allons définir les quelques règles que nous essayons de suivre concernant la structure du projet.

### Mixin SCSS

Si vous devez définir des mixins SCSS, vous devez les implémenter dans le fichier `src/styles/mixin.scss` et ensuite importer ce fichier lorsque vous souhaitez l'utiliser.

### I18N

Dans le but d'éviter d'avoir un fichier d'i18n trop gros, nous avons commencer à découper ce fichier par `page` ou `fontionnalité`. Il y a par exemple un fichier `src/js/i18n/dictionary/operations/documents.js` pour tous les messages utilisés dans la fonctionnalité de gestions des documents.
Ces fichiers doivent ensuite être importés directement ou indirectement dans le fichier principal `js/i18n/dictionary/app.js`
