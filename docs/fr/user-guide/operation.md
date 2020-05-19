# Guide utilisateur du module Opérations statistiques de Bauhaus
Version au 20/05/2020

Le module Opérations encore appelé « Bauhaus-opérations » permet de gérer les opérations statistiques de l'Insee et des SSM.
## Sommaire

- [**Quelques notions pour bien démarrer**](#notions)

- [**Naviguer dans l'application**](#naviguer)

- [**Fonctionnalités de gestion des familles**](#gerer-familles)

  - [Rechercher une famille](#rechercher-famille)
  - [Créer une famille](#creer-famille)
  - [Modifier une famille](#modifier-famille)
  - [Publier une famille](#publier-famille)

---
- [**Fonctionnalités de gestion des séries**](#gerer-series)

  - [Rechercher une série](#rechercher-serie)
  - [Créer une série](#creer-serie)
  - [Modifier une série](#modifier-serie)
  - [Publier une série](#publier-serie)

---
- [**Fonctionnalités de gestion des opérations**](#gerer-operations)

  - [Rechercher une opération](#rechercher-operation)
  - [Créer une opération](#creer-operation)
  - [Modifier une opération](#modifier-operation)
  - [Publier une opération](#publier-operation)

---

- [**Fonctionnalités de gestion des indicateurs**](#gerer-indicateurs)

  - [Rechercher un indicateur](#rechercher-indicateur)
  - [Créer un indicateur](#creer-indicateur)
  - [Modifier un indicateur](#modifier-indicateur)
  - [Publier un indicateur](#publier-indicateur)

---

- [**Fonctionnalités de gestion des documentations Sims**](#gerer-sims)

  - [Créer une documentation Sims](#creer-sims)
  - [Modifier une documentation Sims](#modifier-sims)
  - [Publier une documentation Sims](#publier-sims)

---

- [**Fonctionnalités de gestion des Documents/Liens**](#gerer-documents-liens)
  - [Rechercher un Document/Lien](#rechercher-document-lien)
  - [Créer un document](#creer-document)
  - [Modifier un document](#modifier-document)
  - [Créer un lien](#creer-lien)
  - [Modifier un lien](#modifier-lien)

---

## <a id="notions">Quelques notions pour bien démarrer</a>

### Qu'est-ce qu'une opération statistique ?

Le référentiel de métadonnées statistiques est organisé selon une arborescence :
- Famille d'opérations statistiques
  - Série d'opérations statistiques
    - Opérations statistiques

Dans la suite du document, on pourra utiliser les raccourcis « Famille », « Série » et « Opération » pour mentionner un des trois niveaux.

Une opération statistique peut être définie comme l'ensemble des phases de collecte, de traitement voire de diffusion de données. Cet ensemble peut être millésimé. Il s'agit d'enquêtes statistiques ou d'utilisation de données administratives (ex : l'enquête de fréquentation dans l'hôtellerie 2016, les Déclarations Annuelles de Données Sociales 2015) ou des nouvelles sources de données (ex : mégadonnées ou autres).

Pour illustrer cette hiérarchie, on considérera :
- la famille d'opérations statistiques « Technologie de l'information et de la communication » comprenant trois séries d'opérations statistiques pour distinguer des grands domaines, des processus ou des objectifs :
  - la série d'opérations statistiques : « Enquête annuelle auprès des ménages sur les technologies de l'information et de la communication / TIC-ménages » comprenant une opération statistique pour distinguer le millésime :
    - Enquête annuelle auprès des ménages sur les technologies de l'information et de la communication 2018
  - la série d'opérations statistiques : « Enquête sur l'usage de l'informatique, des technologies de la communication et le commerce électronique dans les entreprises de moins de 10 personnes occupées / TIC-TPE » comprenant deux opérations statistiques pour distinguer chaque millésime :
    - « Enquête sur l'usage de l'informatique et des technologies de la communication dans les entreprises de moins 10 personnes (2012) »
    - « Enquête sur l'usage de l'informatique, des technologies de la communication et le commerce électronique dans les entreprises de moins de 10 personnes occupées (2016) »
  - la série d'opérations statistiques « Enquête sur les technologies de l'information et de la communication dans les entreprises / TIC-entreprises » comprenant quinze opérations statistiques pour distinguer chaque millésime :
    - « Enquête sur les technologies de l'information et de la communication dans les entreprises 2020 »
    - « Enquête sur les technologies de l'information et de la communication dans les entreprises 2019 »
    - « Enquête sur les technologies de l'information et de la communication dans les entreprises 2018 »
    - etc. jusque 2006.
            
### Qu'est-ce qu'un indicateur ?

Un indicateur est une produit statistique qui peut être issu d'une à plusieurs sources.

### Qu'est-ce qu'une documentation Sims ?

La documentation Sims est une norme européenne : le Single Integrated Metadata Structure (SIMS). Il contient une vingtaine de thèmes : présentation statistique, fréquence de diffusion, révision des données, traitement statistique, etc.
Le Sims permet de décrire les opérations statistiques et indicateurs en respectant les principes du code de bonnes pratiques de la statistique européenne. Il concerne tous les producteurs de l'Insee et des SSM.

## <a id="naviguer">Naviguer dans l'application</a>

Pour atteindre la page d'accueil du module de gestion des opérations statistiques, cliquer sur le pavé <span style="color: blue">Opérations</span> de la page d'accueil. La navigation se fait via la barre horizontale de menu en haut de la page.

Un bouton « Voir l'arborescence » disponible via les menus « Familles », « Séries » et « Opérations » permet également d'accéder à l'arborescence de l'ensemble des Familles/Séries/Opérations. 
Dans cette arborescence, les boutons + et - permettent de déplier ou replier l'arborescence, de la famille à l'opération concernée. Un clic sur l'objet famille, série ou opération permet d'accéder à la page de description de cet objet.

Afin de garantir l'intégrité et la qualité de la base, les fonctionnalités de création et modification des familles, de création des séries et indicateurs ainsi que l'identification des propriétaires sont réservés à l'unité Qualité. Toute unité en ayant l'utilité peut demander la création d'une famille, d'une série ou d'un indicateur. La publication est de la responsabilité du propriétaire identifié et renseigné dans l'application, charge à lui éventuellement d'organiser la consultation avec d'autres utilisateurs. Dans l'application, le propriétaire ou par délégation l'unité Qualité sont habilités à publier.

Dans l'application, quatre grands profils d'utilisateurs ont été créés. Chacun correspond à un niveau d'habilitation donnant accès à différentes fonctionnalités :
- **Administrateur de l'application** : accès à toutes les fonctionnalités ;
- **Propriétaire de série** : 
  - rechercher, modifier et publier une série dont il est propriétaire
  - rechercher, créer, modifier et publier une opération appartenant à une des séries dont il est propriétaire
  - rechercher, créer,  modifier et publier  documentation SIMS, un document ou un lien
  - rechercher, créer, modifier et publier un document ou un lien.
- **Propriétaire d'indicateur** : 
  - rechercher, modifier, publier un indicateur dont il est propriétaire
  - rechercher, modifier, publier une documentation SIMS liée à cet indicateur
  - rechercher, créer, modifier et publier un document ou un lien
- **Invité** (profil par défaut pour tout utilisateur se connectant à l'application) : rechercher et consulter une famille d'opérations statistiques, séries d'opérations statistiques, opérations statistiques, indicateurs et une documentation Sims.

**Les boutons correspondant aux différentes fonctionnalités s'affichent en fonction du profil utilisateur.**

Pour toute demande ou question, adresser un message à la boite fonctionnelle : **:DG75-Administration RMéS**

## <a id="gerer-familles">Fonctionnalités de gestion d'une famille d'opérations statistiques</a>

### <a id="rechercher-famille">Rechercher une famille</a>

La page d'accueil Familles, accessible à partir de la barre horizontale de menu, propose deux méthodes de recherche.

- Une barre de recherche principale, qui donne accès à l'ensemble des familles enregistrées dans l'application (1) ;
- Un lien vers la page de recherche avancée, qui permet d'affiner une recherche selon différents critères. (2).

(1) La barre de recherche principale propose un moteur de recherche dans lequel on peut **saisir une suite de caractères correspondant à tout ou partie du libellé ou du nom court recherché**. La recherche se lance automatiquement à mesure que des caractères sont saisis dans la barre de recherche. Les résultats s'affichent sur une ou plusieurs pages en fonction du nombre de familles trouvées.

Cliquer ensuite sur la famille souhaitée pour accéder à sa page de description. Pour consulter la version anglaise, cocher la case : [ ] **Afficher la seconde langue**. Celle-ci s'affichera à droite de la version française.

(2) La recherche avancée est disponible en cliquant sur <span style="color: blue">**Recherche avancée**</span>. Pour affiner la sélection, **renseigner les filtres souhaités dans les champs** :
- **Libellé** : saisir le nom du concept ;
- **Thème** : sélectionner le thème.

La recherche se lance automatiquement à mesure que des critères sont renseignés dans les différents champs. Les résultats s'affichent sur une ou plusieurs pages en fonction du nombre de familles trouvées.

Cliquer ensuite sur la famille souhaitée pour accéder à sa page de description. Pour consulter la version anglaise, cocher la case : [ ] Afficher la seconde langue. Celle-ci s'affichera à droite de la version française.

### <a id="creer-famille">Créer une famille</a>
La création d'une famille est une fonctionnalité réservée à l'Unité Qualité.

### <a id="modifier-famille">Modifier une famille</a>
La modification d'une famille est une fonctionnalité réservée à l'Unité Qualité.

### <a id="publier-famille">Publier une famille</a>
La publication d'une famille est une fonctionnalité réservée à l'Unité Qualité.

## <a id="gerer-series">Fonctionnalités de gestion d'une série d'opérations statistiques</a>

### <a id="rechercher-serie">Rechercher une série</a>

La page d'accueil Séries, accessible à partir de la barre horizontale de menu, propose deux méthodes de recherche :
- Une barre de recherche principale, qui donne accès à l'ensemble des Séries enregistrées dans l'application (1) ;
- Un lien vers la page de recherche avancée, qui permet d'affiner une recherche selon différents critères. (2).

(1) La barre de recherche principale propose un moteur de recherche dans lequel on peut **saisir une suite de caractères correspondant à tout ou partie du libellé ou du nom court recherché**.

La recherche se lance automatiquement à mesure que des caractères sont saisis dans la barre de recherche. Les résultats s'affichent sur une ou plusieurs pages en fonction du nombre de séries trouvées.

Cliquer ensuite sur la série souhaitée pour accéder à sa page de description. Pour consulter la version anglaise, cocher la case : [ ] **Afficher la seconde langue**. Celle-ci s'affichera à droite de la version française.

(2) La recherche avancée est disponible en cliquant sur <span style="color: blue">**Recherche avancée**</span>. Pour affiner la sélection,**renseigner les filtres souhaités** dans les champs :

- **Libellé** : saisir le nom de la série;
- **Type d'opération** : sélectionner le type d'opération dans le menu déroulant
- **Gestionnaire** : sélectionner le gestionnaire dans le menu déroulant
- **Organisme responsable** : sélectionner l'organisme responsable dans le menu déroulant
- **Services collecteurs** : sélectionner le service collecteur dans le menu déroulant.

La recherche se lance automatiquement à mesure que des critères sont renseignés dans les différents champs. Les résultats s'affichent sur une ou plusieurs pages en fonction du nombre de séries trouvées.

Cliquer ensuite sur la série souhaitée pour accéder à sa page de description. Pour consulter la version anglaise, cocher la case : [ ] Afficher la seconde langue. Celle-ci s'affichera à droite de la version française.

### <a id="creer-serie">Créer une série</a>

Avant de créer une série, il est important de vérifier qu'elle n'a pas déjà été renseignée en utilisant les fonctionnalités de recherche.

La création d'une série est possible à partir de  la page d'accueil Séries et est une fonctionnalité réservée à l'Unité Qualité.

- Cliquer sur le bouton <span style="color: blue">Nouveau</span> à gauche de la page. La page de création de la série s'affiche alors.

Les champs disponibles sont les suivants :
- La série doit être rattachée à sa **famille mère**. Si la famille souhaitée n'existe pas, il faut demander sa création à l'équipe d'administration RMéS.
- L'**Intitulé** est le libellé de la série. Les intitulés français et anglais sont obligatoires.
- Le **Nom court** est un libellé alternatif. Il peut s'agir d‘un sigle ou d'un acronyme.
- Le **Résumé** permet d'expliquer les objectifs et une courte description générale du processus et de ses résultats ; du domaine statistique auquel appartiennent les résultats ; des autres résultats statistiques ;
- L' **Historique** est un bref historique du processus statistique et des résultats ;
- Le **type d'opération** prend une des valeurs suivante : Enquête, Source administrative, Synthèse, Indicateur.
- La **Fréquence de collecte** correspond au *rythme* de collecte des données
- L' **Organisme responsable** est l'organisme responsable de la série ;
- Les **Partenaires** sont les organismes associés à la conception et au pilotage de la série ;
- Les **Services collecteurs** correspond aux services réalisant la collecte ;
- Le **Propriétaire** est l'unité responsable de la gestion et de la publication de la série ainsi que des opérations statistiques et documentations Sims qui en découlent ;
- Le champ **Succède à** permet de préciser si une série succède à une autre. Si une Série A succède à une Série B, alors la Série B est automatiquement remplacée par la Série A.
- Le champ **Remplacée par** permet de préciser si une série est remplacée par une autre. Si une Série B est remplacée par une Série A, alors la Série A succède automatiquement remplacée à la la Série B.
- Le champ **Indicateurs produits** permet de préciser les indicateurs produits à partir de la contributions de la série.
- Les **Séries ou Indicateurs liés** permet de renvoyer vers des séries ou des indicateurs connexes.

Le bouton <span style="color: blue">Annuler</span> permet de revenir à la page d'accueil de l'onglet Séries ;*

Le bouton <span style="color: blue">Sauvegarder</span> permet d'enregistrer les données dans la base de gestion.

***NB : Toute sauvegarde est impossible tant que les champs obligatoires, marqués d'une « * », n'ont pas été remplis.***

Le bouton <span style="color: blue">Sauvegarder</span> devient actif après la saisie des champs obligatoires.

**Attention** : Penser à sauvegarder les informations saisies en cliquant sur le bouton en haut à droite avant de changer d'écran.

Il est à noter que la sauvegarde n'entraîne pas la publication de la série. Il est donc possible, si nécessaire, de créer la série en plusieurs étapes.

Le statut de publication de la série passe alors en « Provisoire », jusqu'à sa publication.

Pour publier une série dans le référentiel, voir Publier une série(#publier-serie).

### <a id="modifier-serie">Modifier une série</a>
La modification d'une série est possible à partir de sa page de description.

- Cliquer en haut à droite sur le bouton <span style="color: blue">Modifier</span>.

Les différents champs peuvent alors être modifiés.

Penser à Sauvegarder la saisie avant de changer d'écran.

Une fois la série modifiée, son statut de publication devient **« Provisoire, déjà publiée » ou « Provisoire » si elle n'a jamais été publiée, jusqu'à sa publication**. Tant qu'elle n'est pas publiée dans le référentiel de publication (voir Publier une série), l'ancienne version reste à disposition des applications clientes.

### <a id="publier-serie">Publier une série</a>

La publication d'une série est possible à partir de la page de description d'une série. Seul le propriétaire de la série, ou par délégation l'unité Qualité (après échanges de mails), est habilité à publier une série.

- Cliquer en haut à droite sur <span style="color: blue">Publier</span> après avoir vérifié les informations saisies.

Une série ne peut être publiée que si la famille à laquelle elle est rattachée est déjà publiée. Sinon, publier d'abord la famille. Pour publier cette famille, contacter l'administrateur RMéS.

La série ne peut être publiée que par son propriétaire (i.e la personne désignée dans l'application comme ayant ce rôle et appartenant à l'unité dont le timbre est le même que le propriétaire de la série) et par l'unité Qualité par délégation.

## <a id="gerer-operations">Fonctionnalités de gestion des opérations statistiques</a>

### <a id="rechercher-operation">Rechercher une opération statistique</a>

La page d'accueil Opérations, accessible à partir de la barre horizontale de menu, propose une barre de recherche principale qui donne accès à l'ensemble des Opérations statistiques enregistrées dans l'application.

La barre de recherche principale propose un moteur de recherche dans lequel on peut **saisir une suite de caractères correspondant à tout ou partie du libellé ou du nom court recherché**.

La recherche se lance automatiquement à mesure que des caractères sont saisis dans la barre de recherche. Les résultats s'affichent sur une ou plusieurs pages en fonction du nombre d'opérations statistiques trouvées.

Cliquer sur l'opération statistique souhaitée pour accéder à sa page de description. Pour consulter la version anglaise, cocher la case : [ ] **Afficher la seconde langue**. Celle-ci s'affichera à droite de la version française.

### <a id="creer-operation">Créer une opération statistique</a>

Avant de créer une opération statistique, il est important de vérifier qu'elle n'a pas déjà été renseignée en utilisant les fonctionnalités de recherche.

La création d'une opération est possible à partir de la page d'accueil Opérations.

- Cliquer sur le bouton <span style="color: blue">Nouveau</span> à gauche de la page. La page de création de l'opération s'affiche alors.

Les champs disponibles sont les suivants :
- L'opération doit être rattachée à sa **série mère**. Si la série souhaitée n'existe pas, demander sa création à l'administrateur RMéS, 
- L' **Intitulé** est le libellé de l'opération. Les intitulés français et anglais sont obligatoires.
- Le **Nom court** est un libellé alternatif. Il peut s'agit d‘un sigle ou d'un acronyme.

Le bouton <span style="color: blue">Annuler</span> permet de revenir à la page d'accueil de l'onglet Opérations ;*

Le bouton <span style="color: blue">Sauvegarder</span> permet d'enregistrer les données dans la base de gestion.

***NB : Toute sauvegarde est impossible tant que les champs obligatoires, marqués d'une « * », n'ont pas été remplis.***

Le bouton <span style="color: blue">Sauvegarder</span> devient actif après la saisie des champs obligatoires.

**Attention** : Penser à sauvegarder les informations saisies en cliquant sur le bouton en haut à droite avant de changer d'écran.

Il est à noter que la sauvegarde n'entraîne pas la publication de l'opération. Il est donc possible, si nécessaire, de créer l'opération en plusieurs étapes.

Le statut de publication de l'opération passe alors en « Provisoire », jusqu'à sa publication.

Pour publier une opération dans le référentiel, voir Publier une opération(#publier-operation).

### <a id="modifier-operation">Modifier une opération</a>
La modification d'une opération est possible à partir de sa page de description.

- Cliquer en haut à droite sur le bouton <span style="color: blue">Modifier</span>.

Les différents champs peuvent alors être modifiés.

Penser à Sauvegarder la saisie avant de changer d'écran.

Une fois l'opération modifiée, son statut de publication devient **« Provisoire, déjà publiée » ou « Provisoire » si elle n'a jamais été publiée, jusqu'à sa publication**. Tant qu'elle n'est pas publiée dans le référentiel de publication (voir Publier une opération), l'ancienne version reste à disposition des applications clientes.

### <a id="publier-operation">Publier une opération</a>
La publication d'une opération est possible à partir de la page de description d'une opération. Seul le propriétaire de la série à laquelle appartient l'opération, ou par délégation l'unité Qualité (après échanges de mails), est habilité à publier une opération.

- Cliquer en haut à droite sur <span style="color: blue">Publier</span> après avoir vérifié les informations saisies.

Une opération ne peut être publiée que si la série à laquelle elle est rattachée est déjà publiée. Sinon, publier d'abord la série. 

L'opération ne peut être publiée que par son propriétaire (i.e la personne désignée dans l'application comme ayant ce rôle et appartenant à l'unité dont le timbre est le même que le propriétaire de la série de l'opération statistique) et par l'unité Qualité par délégation.

## <a id="gerer-indicateurs">Fonctionnalités de gestion des indicateurs</a>

### <a id="rechercher-indicateur">Rechercher un indicateur</a>

La page d'accueil Indicateurs, accessible à partir de la barre horizontale de menu, propose deux méthodes de recherche :

- Une barre de recherche principale, qui donne accès à l'ensemble des Indicateurs enregistrés dans l'application (1) ;
- Un lien vers la page de recherche avancée, qui permet d'affiner une recherche selon différents critères (2).

(1) La barre de recherche principale propose un moteur de recherche dans lequel on peut **saisir une suite de caractères correspondant à tout ou partie du libellé ou du nom court recherché**.

La recherche se lance automatiquement à mesure que des caractères sont saisis dans la barre de recherche. Les résultats s'affichent sous le moteur de recherche, sur une ou plusieurs pages en fonction du nombre d'indicateurs trouvés.

Cliquer ensuite sur l'indicateur souhaité pour accéder à sa page de description. Pour consulter la version anglaise, cocher la case : [ ] **Afficher la seconde langue**. Celle-ci s'affichera à droite de la version française.

(2) La recherche avancée est disponible en cliquant sur <span style="color: blue">**Recherche avancée**</span>. Pour affiner la sélection, **renseigner les filtres souhaités** dans les champs :

- **Libellé** : saisir le nom de l'indicateur;
- **Organisme responsable** : sélectionner l'organisme responsable dans le menu déroulant ;
- **Gestionnaire** : sélectionner le gestionnaire dans le menu déroulant ;

La recherche se lance automatiquement à mesure que des critères sont renseignés dans les différents champs. Les résultats s'affichent sur une ou plusieurs pages en fonction du nombre d'indicateurs trouvés. Cliquer ensuite sur l'indicateur recherché pour accéder à sa page de description.

Pour consulter la version anglaise, cocher la case : [ ] **Afficher la seconde langue**. Celle-ci s'affichera à droite de la version française.

### <a id="creer-indicateur">Créer un indicateur</a>

Avant de créer un indicateur, il est important de vérifier qu'il n'a pas déjà été renseigné en utilisant les fonctionnalités de recherche.

La création d'un indicateur est possible à partir de la page d'accueil Indicateurs et est  une fonctionnalité réservée à l'Unité Qualité.

- Cliquer sur le bouton <span style="color: blue">Nouveau</span> à gauche de la page. La page de création de l'indicateur s'affiche alors.

Les champs disponibles sont les suivantes :
- L'**Intitulé** est le libellé de l'indicateur. Les intitulés français et anglais sont obligatoires.
- Le **Nom court** est un libellé alternatif. Il peut s'agir d‘un sigle ou d'un acronyme.
- Le **Résumé** permet d'expliquer les objectifs et une courte description générale du processus et de ses résultats ; du domaine statistique auquel appartiennent les résultats ; des autres résultats statistiques ;
- L'**Historique** est un bref historique du processus statistique et des résultats ;
- La **Fréquence de diffusion** correspond au *rythme* de collecte des données
- L'**Organisme responsable** est l'organisme responsable de l'indicateur ;
- Les **Partenaires** sont les organismes associés à la conception et au pilotage de l'indicateur ;
- Le **Propriétaire** est l'unité responsable de la gestion et de la publication de l'indicateur ainsi que des opérations statistiques et documentations Sims qui en découlent ;
- Le champ **Succède à** permet de préciser si un indicateur succède à un autre. Si un indicateur A succède à un indicateur B, alors l'indicateur B est automatiquement remplacé par l'indicateur A.
- Le champ **Remplacée par** permet de préciser si un indicateur est remplacé par un autre. Si un indicateur B est remplacé par un indicateur A, alors l'indicateur A succède automatiquement à l'indicateur B.
- Le champ **Produits de** permet de préciser les séries contribuant à la production de l'indicateur ;
- Les **Séries ou Indicateurs liés** permet de renvoyer vers des séries ou des indicateurs connexes.

Le bouton <span style="color: blue">Annuler</span> permet de revenir à la page d'accueil de l'onglet Indicateurs ;*

Le bouton <span style="color: blue">Sauvegarder</span> permet d'enregistrer les données dans la base de gestion.
***NB : Toute sauvegarde est impossible tant que les champs obligatoires, marqués d'une « * », n'ont pas été remplis.***

Le bouton <span style="color: blue">Sauvegarder</span> devient actif après la saisie des champs obligatoires.

**Attention** : Penser à sauvegarder les informations saisies en cliquant sur le bouton en haut à droite avant de changer d'écran.

Il est à noter que la sauvegarde n'entraîne pas la publication de l'indicateur. Il est donc possible, si nécessaire, de créer l'indicateur en plusieurs étapes.

Le statut de publication de l'indicateur passe alors en « Provisoire », jusqu'à sa publication.

Pour publier un indicateur dans le référentiel, voir Publier un indicateur(#publier-indicateur).

## <a id="modifier-indicateur">Modifier un indicateur</a>
La modification d'un indicateur est possible à partir de sa page de description.

- Cliquer en haut à droite sur le bouton <span style="color: blue">Modifier</span>.

Les différents champs peuvent alors être modifiés.

Penser à Sauvegarder la saisie avant de changer d'écran.

Une fois l'indicateur modifié, son statut de publication devient « Provisoire, déjà publiée » ou **« Provisoire » s'il n'a jamais été publié, jusqu'à sa publication**. Tant qu'il n'est pas publié dans le référentiel de publication (voir Publier un indicateur(#publier-indicateur)), l'ancienne version reste à disposition des applications clientes.

## <a id="publier-indicateur">Publier un indicateur</a>
La publication d'un indicateur est possible à partir de sa page de description. Seul le propriétaire de l'indicateur, ou par délégation l'unité Qualité (après échanges de mails), est habilité à publier un indicateur.

- Cliquer en haut à droite sur <span style="color: blue">Publier</span> après avoir vérifié les informations saisies.

L'indicateur ne peut être publié que par son propriétaire (i.e la personne désignée dans l'application comme ayant ce rôle et appartenant à l'unité dont le timbre est le même que le propriétaire de l'indicateur) ou par l'unité Qualité par délégation.

## <a id="gerer-sims">Gérer une documentation statistique</a>
### <a id="creer-sims">Créer une documentation Sims</a>

La création d'une documentation Sims est possible à partir de son opération.

- Cliquer sur le bouton <span style="color: blue">Créer le Sims</span> en haut de la page. La page de création de la documentation Sims s'affiche alors.

Le bouton <span style="color: blue">Annuler</span> permet de revenir à la page d'accueil de l'opération ;*

Le bouton <span style="color: blue">Sauvegarder</span> permet d'enregistrer les données dans la base de gestion.

**Attention** : Penser à sauvegarder les informations saisies en cliquant sur le bouton en haut à droite avant de changer d'écran.

Il est à noter que la sauvegarde n'entraîne pas la publication de la documentation. Il est donc possible, si nécessaire, de créer la documentation en plusieurs étapes.

Le statut de publication de la documentation passe alors en « Provisoire », jusqu'à sa publication.

Pour publier une documentation dans le référentiel, voir Publier une documentation(#publier-sims).

### <a id="modifier-sims">Modifier une documentation Sims</a>

La modification d'une documentation est possible à partir de sa page de description.

- Cliquer en haut à droite sur le bouton <span style="color: blue">Modifier</span>.

Les différents champs peuvent alors être modifiés.

Penser à Sauvegarder la saisie avant de changer d'écran.

Une fois la documentation modifiée, son statut de publication devient « Provisoire, déjà publiée » ou **« Provisoire » si elle n'a jamais été publiée, jusqu'à sa publication**. Tant qu'elle n'est pas publiée dans le référentiel de publication (voir Publier une documentation), l'ancienne version reste à disposition des applications clientes.

### <a id="publier-sims">Publier une documentation Sims</a>
La publication d'une documentation est possible à partir de sa page de description. Seul le propriétaire de la documentation, ou par délégation l'unité Qualité (après échanges de mails), est habilité à publier une documentation.

- Cliquer en haut à droite sur <span style="color: blue">Publier</span> après avoir vérifié les informations saisies.

Une documentation ne peut être publiée que si l'opération à laquelle elle est rattachée est déjà publiée. Sinon, publier d'abord l'opération. 

La documentation ne peut être publiée que par son propriétaire (i.e la personne désignée dans l'application comme ayant ce rôle et appartenant à l'unité dont le timbre est le même que le propriétaire de la série de l'opération statistique) et par l'unité Qualité par délégation.

## <a id="gerer-documents-liens">Fonctionnalités de gestions des documents et des liens</a>

Un menu Documents/Liens, situé en haut à droite, permet de gérer des documents et des liens utiles à certaines rubriques du SIMS. 

Ces documents et liens, une fois créés sont réutilisables autant que de besoin dans les rubriques de la documentation Sims.

### <a id="rechercher-document-lien">Rechercher un document ou un lien</a>

La page d'accueil Documents / Liens, accessible à partir de la barre horizontale de menu, propose une barre de recherche principale qui, donne accès à l'ensemble des Documents et Liens enregistrées dans l'application.

Le bouton <span style="color: blue"Documents / Liens</span> permet de rechercher des documents et/ou des liens.

Le bouton <span style="color: blue"Documents</span> permet filtrer la rechercher sur mes documents.

Le bouton <span style="color: blue"Liens</span> permet de filtrer la recherche sur les liens.

La barre de recherche principale propose un moteur de recherche dans lequel on peut **saisir une suite de caractères correspondant à tout ou partie du libellé recherché**. La recherche se lance automatiquement à mesure que des caractères sont saisis dans la barre de recherche. Les résultats s'affichent sous le moteur de recherche, sur une ou plusieurs pages en fonction du nombre de documents ou liens trouvés.

Cliquer sur le document ou le lien souhaité pour accéder à sa page de description. Pour consulter la version anglaise, cocher la case : [ ] **Afficher la seconde langue**. Celle-ci s'affichera à droite de la version française.

### <a id="creer-document">Créer un document</a>

Avant de créer un document, il est important de vérifier qu'il n'a pas déjà été renseigné en utilisant les fonctionnalités de recherche.

La création d'un document est possible à partir de la page d'accueil Documents / Liens.

- Cliquer sur le bouton <span style="color: blue">Nouveau Document</span> à gauche de la page. La page de création du document s'affiche alors.

Les champs disponibles sont les suivants :
- L'**Intitulé** est le libellé du document. Les intitulés français et anglais sont obligatoires ;
- La **Description** permet de décrire le document. Il s'agit d'une information que l'on peut retrouver en infobulle.
- La **Date de mise à jour** est la date de dernière mise à jour du document. La date de mise à jour est obligatoire ;
- Pour joindre un **Fichier**, se placer sur le champ ad hoc et faire un « glisser-déposer » ou cliquer dans le champ pour ajouter le document. Le document est obligatoire ;
- La **Langue** correspond à la langue du contenu du document. La langue est obligatoire.

Le bouton <span style="color: blue">Annuler</span> permet de revenir à la page d'accueil de l'onglet Documents / : Liens ;*

Le bouton <span style="color: blue">Sauvegarder</span> permet d'enregistrer les données dans la base de gestion.

***NB : Toute sauvegarde est impossible tant que les champs obligatoires, marqués d'une « * », n'ont pas été remplis.***

**Attention** : Penser à sauvegarder les informations saisies en cliquant sur le bouton en haut à droite avant de changer d'écran.

## <a id="modifier-document">Modifier un document</a>
La modification d'un document est possible à partir de sa page de description.

- Cliquer sur le bouton <span style="color: blue">Modifier</span>. Les différents champs peuvent alors être modifiés.

Penser à Sauvegarder la saisie avant de changer d'écran.

***NB : Toute sauvegarde est impossible tant que les champs obligatoires, marqués d'une « * », n'ont pas été remplis.***

## <a id="creer-lien">Créer un lien</a>
Avant de créer un lien, il est important de vérifier qu'il n'a pas déjà été renseigné en utilisant les fonctionnalités de recherche.

La création d'un lien est possible à partir du menu Documents / Liens.

- Cliquer sur le bouton <span style="color: blue">Nouveau Lien</span> à gauche de la page. La page de création du lien s'affiche alors.

Les champs disponibles sont les suivants :
- L' **Intitulé** est le libellé du lien. Les intitulés français et anglais sont obligatoires.
- La **Description** permet de décrire le lien. Il s'agit d'une information que l'on peut retrouver en infobulle ;
- Le **Lien** correspond à l'URL de la page sur laquelle renvoyer. Le lien est obligatoire.
- La **Langue** correspond à la langue du contenu de la page sur laquelle on renvoie. La langue est obligatoire.

Le bouton <span style="color: blue">Annuler</span> permet de revenir à la page d'accueil de l'onglet Documents : Liens ;*

Le bouton <span style="color: blue">Sauvegarder</span> permet d'enregistrer les données dans la base de gestion.

***NB : Toute sauvegarde est impossible tant que les champs obligatoires, marqués d'une « * », n'ont pas été remplis.***

**Attention** : Penser à sauvegarder les informations saisies en cliquant sur le bouton en haut à droite avant de changer d'écran.

## <a id="modifier-lien">Modifier un lien</a>
La modification d'un lien est possible à partir de sa page de description.

- Cliquer sur le bouton <span style="color: blue">Modifier</span>.

Les différents champs peuvent alors être modifiés.

Penser à Sauvegarder la saisie avant de changer d'écran.

***NB : Toute sauvegarde est impossible tant que les champs obligatoires, marqués d'une « * », n'ont pas été remplis.***
