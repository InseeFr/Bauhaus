# Démarrage

Bauhaus est une application Web monopage construite avec [React](https://facebook.github.io/react/) et [Redux](https://github.com/reactjs/reduxreact). Elle est packagée par [Create React App](https://github.com/facebook/create-react-app) et les styles proviennent de [Bootstrap](https://github.com/twbs/bootstrap). Pour lancer l'application en développement, vous pouvez exécuter les commandes suivantes à partir d'un terminal dans le dossier Bauhaus, et visualiser ensuite la page [http://localhost:3000](http://localhost:3000):

```
# Téléchargement des dépendances
yarn install
# Compilation du code et démarrage d'un serveur de développement
yarn start
```

L'application s'appuie sur des Web services externes : Bauhaus-Back-Office(https://github.com/InseeFr/Bauhaus-Back-Office).

## Test

Les tests peuvent être lancés de façon interactive avec la commande `yarn test`. Par défaut, seuls les tests impliquant des fichiers modifiés depuis le dernier commit seront éxécutés.
Un script supplémentaire, `yarn test:coverage` permet de générer un rapport local complet `Bauhaus/coverage/lcov-report/index.html`.

## Build

Pour produire la version de production, lancez la commande `yarn build`. Vous pouvez désormais servir le contenu du dossier `dist` avec le serveur web de votre choix.

## Débuter avec JavaScript et Node.js

Si vous débutez avec ces technologies, vous aurez vraisemblablement besoin d'installer dans un premier temps sur votre ordinateur [node](https://nodejs.org/en/download/) et [yarn](https://github.com/yarnpkg/yarn).

`yarn` est un gestionnaire de modules pour `Node.js`. `yarn install` téléchargera toutes les dépendances du projet, décrites dans la section `dependencies` et `devDepedencies` du fichier [package.json](https://github.com/InseeFr/Bauhaus/blob/master/package.json).

`yarn start` démarre un serveur de développement qui sert la page d'accueil de l'application ([src/js/index.html](https://github.com/InseeFr/Bauhaus/blob/master/public/index.html)) et toutes les ressources nécessaires.

`yarn build` lance la compilation du code avec des optimisations pour la mise en production. Elle copie toutes les ressources statiques et le fichier `JavaScript` compilé dans le dossier `dist`.
