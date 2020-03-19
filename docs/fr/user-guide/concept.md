
# Guide utilisateur du module Concepts de Bauhaus
Version au 19/03/2020

Le module Concepts encore appelée "Bauhaus-concepts" permet de gérer les concepts utiles à des fins statistiques.

## Sommaire

- [**Naviguer dans l'application**](#naviguer)

- [**Fonctionnalités de gestion des concepts**](#fonctionnalites-concepts)

  - [Rechercher un concept](#rechercher-concept)
  - [Exporter un ou plusieurs concepts](#exporter-concept)
  - [Créer un concept](#creer-concept)
  - [Modifier un concept](#modifier-concept)
  - [Créer une nouvelle version](#creer-version-concept)
  - [Comparer les versions](#comparer-versions)
  - [Envoyer un concept](#envoyer-concept)
  - [Publier un concept](#publier-concept)

---

- [**Fonctionnalités de gestion des collections de concepts**](#fonctionnalites-collections-concepts)

  - [Rechercher une collection de concepts](#rechecher-collection)
  - [Exporter une collection de concepts](#exporter-collection)
  - [Créer une collection de concepts](#creer-collection)
  - [Modifier une collection de concepts](#modifier-collection)
  - [Envoyer une collection de concepts](#envoyer-collection)
  - [Publier une collection de concepts](#publier-collection)

- [**Administration**](#administration)
  - [Suivre l'activité du référentiel](#suivre-concepts)

---

## <a id="naviguer">Naviguer dans l'application</a>

Pour atteindre la page d'accueil du module de gestion des concepts, cliquer sur le pavé <span style="color: blue">Concepts</span> de la page d'accueil.
La navigation se fait via la barre horizontale de menu en haut de la page.

*Toute unité en ayant l'utilité peut demander la création d'un concept. Cependant, afin de garantir l'intégrité et la qualité de la base, la création et la modification des concepts, ainsi que l'identification du propriétaire, sont réservés à l'unité Qualité. La publication est de la responsabilité du propriétaire identifié et renseigné dans l'application ; charge à lui d'éventuellement organiser la consultation avec d'autres utilisateurs. Dans l'application, l'unité Qualité est habilitée à publier un concept sur demande du propriétaire.*

*La création d'une collection de concepts peut être demandée à l'unité Qualité par toute unité ayant l'utilité de rassembler plusieurs concepts pour un usage particulier (par exemple : documenter un Insee-Résultats). L'unité ayant fait la demande est l'unité propriétaire de la collection, qui peut regrouper des concepts dont elle n'est pas propriétaire. Un concept peut appartenir à plusieurs collections et être utilisé par plusieurs utilisateurs dans différentes collections. Le propriétaire d'une collection peut la modifier à tout moment. Dans l'application, l'unité qualité est habilitée à publier une collection sur demande du propriétaire.*

Dans l'application, quatre grands profils d’utilisateurs ont été créés. Chacun correspond à un niveau d’habilitation donnant accès à différentes fonctionnalités :

- **Administrateur de l'application** : accès à toutes les fonctionnalités ;
- **Gestionnaire de l'ensemble des concepts** : rechercher, exporter, créer, modifier, envoyer, publier un concept ou une collection, et comparer les versions des caractéristiques d'un concept ;
- **Propriétaire de collection de concepts** : rechercher, exporter, créer, modifier, envoyer ou publier une collection ;
- **Invité** (profil par défaut pour tout utilisateur se connectant à l'application) : rechercher, exporter, envoyer un concept ou une collection, et comparer les versions des caractéristiques d'un concept.

**Les boutons permettant d'accéder aux différentes fonctionnalités s'affichent en fonction du profil utilisateur.**

Pour toute demande ou question, adresser un message à la boite fonctionnelle :

**:DG75-Administration RMéS**

---

## <a id="fonctionnalites-concepts">Fonctionnalités de gestion des concepts</a>

### <a id="rechercher-concept">Rechercher un concept</a>

La page d’accueil Concepts, accessible à partir de la barre horizontale de menu, propose deux méthodes de recherche :

- Une barre de recherche principale, qui donne accès à l’ensemble des concepts enregistrés dans l’application (1) ;
- Un lien vers la page de recherche avancée, qui permet d’affiner une recherche selon différents critères (2).

1. La barre de recherche principale propose un moteur de recherche dans lequel on peut **saisir une suite de caractères correspondant à tout ou partie du libellé, du sigle, du nom court ou du synonyme recherché**. La recherche se lance automatiquement à mesure que des caractères sont saisis dans la barre de recherche.

L'application génère une liste de résultats sous le moteur de recherche, sur une ou plusieurs pages en fonction du nombre de concepts trouvés.

Cliquer sur le concept souhaité pour accéder à sa page de description. Sur cette page, il est possible de consulter la version anglaise, en cochant la case : [ ] **Afficher la seconde langue**. Celle-ci s’affichera à droite de la version française.

2. La recherche avancée est disponible en cliquant sur <span style="color: blue">**Recherche avancée**</span>. Pour affiner la sélection :

- **Saisir les filtres souhaités** dans les champs :

  - *Libellé* : saisir le nom du concept ;
  - *Libellé alternatif* : saisir le sigle, l'acronyme, ou le synonyme ;
  - *Recherche dans la définition* : saisir un ou plusieurs mots du texte de la définition en français ;
  - *Sélectionner un timbre* : choisir un timbre dans la liste pour obtenir la liste des concepts de la responsabilité de cette unité ;
  - *Sélectionner un statut de diffusion*, à choisir parmi :
    - Public générique (publié à la rubrique Définitions sur insee.fr) ;
    - Public spécifique (non publié à la rubrique Définitions, mais disponible pour documenter une publication, un produit) ;
    - Privé (usage interne).
  - *Sélectionner le statut de publication*, à choisir parmi :
    - Publié ;
    - Provisoire (en cours de modification ou en attente de publication).
  - *Sélectionner les plages de date de création ou de modification* du concept recherché.

La recherche se lance automatiquement à mesure que des caractères sont saisis dans les différents champs. Cliquer ensuite sur le concept recherché pour accéder à sa page de description.

Pour consulter la version anglaise, cocher la case : [ ] **Afficher la seconde langue**. Celle-ci s’affichera à droite de la version française.

---

## <a id="exporter-concept">Exporter un ou plusieurs concepts</a>

L'export de la description d'un ou plusieurs concepts est possible à partir de la page d'accueil Concepts :

- Cliquer sur le bouton <span style="color: blue">Exporter</span> à gauche de la page ;

- Faire défiler la liste des concepts à droite pour trouver les concepts souhaités, ou utiliser la barre de recherche en haut de la liste des concepts ;

- Cliquer sur le bouton <img src="../../img/add.png" width="18"> des concepts à exporter pour les intégrer au bloc d'export de gauche, ou sur le bouton <img src="../../img/del.png" width="18"> pour les retirer ;

- Une fois les concepts sélectionnés, cliquer sur <span style="color: blue">Exporter</span> en haut à droite. Une boîte de dialogue s'ouvre ;

- Choisir le format souhaité (PDF ou ODT). La fenêtre de téléchargement s'ouvre ensuite avec les options « ouvrir » et « enregistrer ». En cas d'export de plusieurs concepts, il y a autant de fichiers et de fenêtres de téléchargement que de concepts exportés.

***NB : Le format ODT permet d'échanger avec des interlocuteurs pour la mise au point d'une définition, tandis que le format PDF est à usage d'information.***

---

## <a id="envoyer-concept">Envoyer un concept</a>

L'envoi d'un concept est possible à partir de la page de description d'un concept :

- Cliquer sur le bouton <span style="color: blue">Envoyer</span> en haut de l'écran. Une nouvelle page s'affiche alors, permettant d'envoyer à un destinataire un message avec en pièce jointe la description du concept au format ODT, ainsi qu'un lien vers la page du concept dans l'application. L'objet du message et le corps du texte peuvent être modifiés pour personnaliser l'envoi ;

***NB : Ce service n'est pas relié à l'annuaire : il faut donc saisir l'adresse mail complète pour tous les destinataires.***

- Lorsque l'adresse mail du destinataire est renseignée et le texte prêt, cliquer en haut à droite sur le bouton <span style="color: blue">Envoyer</span> pour transmettre le mail.

---

## <a id="creer-concept">Créer un concept</a>

**Avant de créer un concept, il est important de vérifier qu'il n'a pas déjà été renseigné dans l'application en utilisant les [fonctionnalités de recherche](#rechercher-concept).**

La création d'un concept est possible à partir de la page d'accueil Concepts.

- Cliquer sur le bouton <span style="color: blue">Nouveau</span> du menu à gauche de la page. La première page de création du concept s'affiche alors.

Le bouton <span style="color: blue">Annuler</span> permet de revenir à la page d'accueil de l'onglet Concept.

Le bouton <span style="color: blue">Sauvegarder</span> permet d'enregistrer les données dans la base de gestion.

***NB : Toute sauvegarde est impossible tant que les champs obligatoires, marqués d'une « * », n'ont pas été remplis.***

Trois onglets sont disponibles pour définir le concept : <span style="color: blue">Informations générales</span> (1), <span style="color: blue">Notes</span> (2) et <span style="color: blue">Liens</span> (3).

1. Dans l'onglet <span style="color: blue">Informations générales</span>, vous pouvez renseigner différentes informations, à savoir :

- Le **« Libellé »** : le nom du concept, **obligatoire afin de pouvoir créer un concept** ;
- Le **« Libellé alternatif »** : il s'agit d'un libellé secondaire, d'un sigle ou d'un acronyme (il est possible d'ajouter ou de supprimer des libellés alternatifs en cliquant sur + ou -) ;
- Le **« Propriétaire »** : le timbre de l'unité responsable de la description du concept ;
- Le **« Gestionnaire »** : l'unité habilitée à créer / modifier le concept. Il s'agit de l'unité Qualité (DG75-L201) qui assure la gestion des concepts ;
- Le **« Statut de diffusion »**, qui peut être :
  - Privé : la diffusion est réservée à un usage interne ;
  - Public générique : la diffusion est destinée à la rubrique « Définitions » de insee.fr ;
  - Public spécifique : la diffusion est restreinte à la documentation des publications et n'apparaît pas à la rubrique Définitions.
- Le **« Document lié »** : permet d'insérer un lien vers une page Internet ;
- La **« Date de fin de validité »** : **ne doit pas être renseignée à la création** : dès lors que cette date est renseignée, et qu'elle a été atteinte, le concept ne peut plus être modifié.

2. Dans l'onglet <span style="color: blue">Notes</span>, vous pouvez renseigner différentes informations, à savoir :

- **Définition courte** : elle reprend généralement la première phrase de la définition, et ne doit pas comporter plus de 350 caractères. La saisie peut être mise en forme avec des puces ou des numéros en cliquant sur les icônes correspondantes, au-dessus de l’encadré à compléter. **La définition courte est obligatoire pour tous les concepts, hormis ceux dont le statut de diffusion est « Privé » ;**

- **Définition** : la définition est la définition longue, et doit commencer en reprenant intégralement la définition courte. La saisie peut être mise en forme avec des puces ou des numéros en cliquant sur les icônes correspondantes, au-dessus de l'encadré à compléter ;

- **Note éditoriale** : elle correspond à la rubrique « Remarques » des définitions sur insee.fr. **Attention** : il n'est pas nécessaire de saisir le mot « Remarques » dans l'encadré à compléter, car cet intitulé est déjà prévu sur insee.fr ;

- **Note de changement** : il s'agit d’une courte notification à usage interne, permettant de commenter la création ou la modification de la définition. Cette « Note de changement » peut être renseignée à tout moment, y compris à la création du concept, notamment pour documenter le contexte de sa création.

3. Dans l'onglet <span style="color: blue">Liens</span>, vous pouvez renseigner différentes informations, à savoir :

- Plusieurs types de liens permettant de naviguer d'un concept vers un autre. Ces liens sont porteurs de sens et fournissent une information complémentaire à la définition. Ils doivent être publiés avec la définition. Pour ajouter un lien, choisir le type d'onglet correspondant au lien à poser, puis faire défiler la liste des concepts à droite pour trouver le lien souhaité, ou utiliser la barre de recherche en haut de la liste des concepts. Cliquer sur le bouton <img src="../../img/add.png" width="18"> du lien à ajouter, ou sur le bouton <img src="../../img/del.png" width="18"> pour le retirer.

- Onglets <span style="color: blue">Parent</span> et <span style="color: blue">Enfant</span> : il s'agit des liens hiérarchiques qui permettent de relier un concept général à des concepts plus spécifiques et inversement (exemple : « Vacances » est le concept parent de « Vacances d'été » et « Vacances d'hiver »).

***NB : La pose d'un lien Parent d’un concept A vers un concept B entraîne automatiquement l'ajout d’un lien Enfant du concept B vers le concept A. Un concept parent peut donc avoir plusieurs concepts enfants, mais un concept enfant ne peut avoir qu’un concept parent.***

- Onglet <span style="color: blue">Référence</span> : il s’agit de mettre en place des hyperliens vers les concepts cités dans le texte de la définition. Un concept peut ainsi référencer plusieurs concepts ;

- Onglet <span style="color: blue">Remplace</span> : ces liens permettent de reconstituer l'historique du concept (exemple : le RSA remplace le RMI, le microentrepreneur remplace l'autoentrepreneur, etc.). L'ajout d’un lien <span style="color: blue">Remplace</span> du concept A vers le concept B entraîne la création d'un lien « est remplacé par » du concept B vers le concept A.

***NB : Un concept peut être remplacé par un ou plusieurs concepts, et inversement.***

- Onglet Lié : ces liens sont de type « voir aussi » et permettent de renvoyer vers des concepts connexes.

Le bouton <span style="color: blue">Sauvegarder</span> devient actif après la saisie des champs obligatoires.

**Attention** : Penser à sauvegarder les informations saisies en cliquant sur le bouton en haut à gauche avant de changer d'écran.

Il est à noter que la sauvegarde n'entraîne pas la publication du concept. En effet, celui-ci doit au préalable avoir été publié par son propriétaire, ou par délégation (après échanges de mails) par l'unité Qualité. Il est donc possible, si nécessaire, de créer un concept en plusieurs étapes.

Le statut de publication du concept passe alors en **« Provisoire », jusqu'à sa publication**.

Pour envoyer la description du concept par mail à un interlocuteur (en particulier à son propriétaire), voir [Envoyer un concept](#envoyer-concept).

Pour publier un concept dans le référentiel, voir [Publier un concept](#publier-concept).

---

## <a id="modifier-concept">Modifier un concept</a>

La modification d'un concept est possible à partir de la page de description d'un concept.

- Cliquer en haut à droite sur le bouton <span style="color: blue">Modifier</span>.

Les différents champs peuvent alors être modifiés, et les consignes décrites dans la fonctionnalité [Créer un concept] s'appliquent alors.

Une fois le concept modifié, son statut de publication devient **« Provisoire », jusqu’à sa publication**. Tant qu’il n'est pas publié dans le référentiel de publication (voir [Publier un concept](#publier-concept)), l'ancienne version reste à disposition des applications clientes.

La modification des notes « Définition courte », « Définition » et « Note éditoriale » peuvent donner lieu à la création de nouvelles versions de ces notes (voir [Créer une nouvelle version](#creer-nouvelle-version)).

---

## <a id="creer-version-concept">Créer une nouvelle version</a>

Lorsque l'on [modifie](#modifier-concept) une définition courte, une définition longue ou la note éditoriale d'un concept, au moment de cliquer sur <span style="color: blue">Sauvegarder</span>, une boîte de dialogue s'ouvre pour demander de choisir entre créer une nouvelle version ou écraser la version courante.

- L’option « écraser la version courante » est utilisée dans le cas d’une modification simple, par exemple pour corriger l’orthographe ou la syntaxe d’une définition ou d’une note éditoriale.

- Dès lors que la modification d’une définition ou d’une note éditoriale fait évoluer le sens d’un concept, l’option « créer une nouvelle version » doit être utilisée afin de permettre aux propriétaires successifs du concept de comprendre le cheminement qui a conduit à sa définition courante. Ainsi, créer une nouvelle version permet de garder trace des définitions précédentes, de manière à pouvoir comparer les différentes versions successives.

**La note de changement est obligatoire pour créer une nouvelle version de la définition.** C'est une note à usage interne : elle est destinée à garder trace de l'origine et du contexte des modifications.

- Pour continuer, renseigner la note de changement, puis procéder aux modifications comme indiqué à la rubrique **« Modifier un concept »**.

***NB : Le processus de versionnement ne s'active que lorsque l'on veut modifier un concept publié. Si le concept est en attente de publication (c'est-à-dire si son statut de publication est provisoire) les modifications successives ne donnent pas lieu à versionnement. Les nouvelles définitions et notes écrasent les anciennes versions.***

---

## <a id="comparer-versions">Comparer les versions d'un concept</a>

Lorsque plusieurs versions de notes (définition courte, définition longue ou note éditoriale) existent, on peut les comparer en cliquant en haut à gauche sur le bouton <span style="color: blue">Comparer</span> de l'écran de description d'un concept. Un menu déroulant permet de sélectionner les versions que l'on souhaite comparer.

- Les deux versions sélectionnées s'affichent alors en vis-à-vis ;

- Pour revenir à la version courante, cliquer en haut à gauche sur <span style="color: blue">Revenir à la version courante</span>.

---

## <a id="publier-concept">Publier un concept</a>

La publication d'un concept est possible à partir de la page de description d'un concept. Seul le propriétaire du concept, ou par délégation l'unité Qualité (après échanges de mails), est habilité à publier un concept.

- Cliquer en haut à droite sur <span style="color: blue">Publier</span> après avoir vérifié les informations saisies.

Pour rechercher les concepts à publier, utiliser la recherche avancée à partir de la page d'accueil Concepts en sélectionnant **le statut de publication « Provisoire »**, et éventuellement **le timbre**. La liste des concepts à publier s'affiche alors automatiquement sous le moteur de recherche.

---

# <a id="fonctionnalites-collections-concepts">Fonctionnalités de gestion des collections de concepts</a>
## <a id="rechecher-collection">Rechercher une collection de concepts</a>

La recherche d'une collection est possible à partir de la page d'accueil <span style="color: blue">Collections</span> dans la barre horizontale de menu. La page propose un moteur de recherche sur la totalité des collections de concepts enregistrées dans l'application.

- La barre de recherche propose un moteur de recherche dans lequel on peut **saisir une suite de caractères correspondant à tout ou partie du libellé, du sigle, du nom court ou du synonyme recherché**. La recherche se lance automatiquement à mesure que des caractères sont saisis dans la barre de recherche ;

- L'application génère une liste de résultats sous le moteur de recherche sur une ou plusieurs pages en fonction du nombre de collections trouvés ;

- Cliquer ensuite sur la collection souhaitée pour accéder à sa page de description. Sur cette page, il est possible de consulter la version anglaise, en cochant la case : [ ] **Afficher la seconde langue**. Celle-ci s’affichera à droite de la version française.

---

## <a id="exporter-collection">Exporter une ou plusieurs collections de concepts</a>

L'export d'une ou plusieurs collections de concepts est possible à partir de la page d'accueil <span style="color: blue">Collections</span>.

- Cliquer sur le bouton <span style="color: blue">Exporter</span> à gauche de la page ;

- Faire défiler la liste des collections à droite pour trouver les collections souhaitées, ou utiliser la barre de recherche en haut de la liste des collections ;

- Cliquer sur le bouton <img src="../../img/add.png" width="18"> des collections à exporter pour les intégrer au bloc d'export de gauche, ou sur le bouton <img src="../../img/del.png" width="18"> pour les retirer ;

- Une fois la ou les collections sélectionnées, cliquer sur <span style="color: blue">Exporter</span> en haut à droite ;

- Une boite de dialogue s'ouvre. Choisir le format souhaité (PDF ou ODT). La fenêtre de téléchargement s'ouvre ensuite avec les options « ouvrir » et « enregistrer ». En cas d'export de plusieurs collections, il y a autant de fichiers et de fenêtres de téléchargement que de collections exportées.

---

## <a id="creer-collection">Créer une collection de concepts</a>

**Avant de créer une collection, il est important de vérifier qu'elle n'a pas déjà été renseignée dans l'application en utilisant les [fonctionnalités de recherche](#rechercher-collection).**

La création d'une collection de concepts est possible à partir de la page d'accueil <span style="color: blue">Collections</span>.

- Cliquer sur le bouton <span style="color: blue">Nouvelle</span> du menu à gauche de la page. La première page de création de la collection s'affiche alors.

Le bouton <span style="color: blue">Annuler</span> permet de revenir à la page d'accueil de l'onglet <span style="color: blue">Collections</span>.

Le bouton <span style="color: blue">Sauvegarder</span> permet d'enregistrer les données dans la base de gestion.

***NB : Toute sauvegarde est impossible tant que les champs obligatoires, marqués d'une « * », n'ont pas été remplis.***

- En bas de page, sélectionner les concepts à inclure dans la collection en utilisant les boutons <img src="../../img/add.png" width="18"> et <img src="../../img/del.png" width="18"> pour respectivement les ajouter ou les retirer. Pour rechercher un concept, saisir une suite de caractères contenue dans le libellé du concept recherché dans la barre de recherche au-dessus de la liste.

Le bouton <span style="color: blue">Sauvegarder</span> devient actif après la saisie des champs obligatoires.

**Attention** : Penser à sauvegarder les informations saisies en cliquant sur le bouton en haut à droite avant de changer de page.

Il est à noter que la sauvegarde n'entraîne pas la publication de la collection. En effet, celle-ci doit au préalable avoir été publiée par son propriétaire, ou par délégation (après échanges de mails), par l'unité Qualité. Il est donc possible, si nécessaire, de créer une collection en plusieurs étapes.

Le statut de publication de la collection passe alors en **« Provisoire », jusqu'à sa publication.**

Pour envoyer une collection de concepts par mail à un interlocuteur (en particulier à son propriétaire), voir [Envoyer une collection de concepts](#envoyer-collection).

Pour publier une collection dans le référentiel, voir [Publier une collection de concepts](#publier-collection).

---

## <a id="modifier-collection">Modifier une collection de concepts</a>

La modification d'une collection de concepts est possible à partir de la page de description d'une collection.

- Cliquer en haut à droite sur le bouton <span style="color: blue">Modifier.</span>

Les différents champs peuvent alors être modifiés, et les consignes décrites dans la fonctionnalité [Créer une collection de concepts](#creer-collection) s'appliquent alors.

Une fois la collection modifiée, son statut de publication devient **« Provisoire », jusqu’à sa publication**. Tant qu’elle n'est pas publiée dans le référentiel de publication (voir [Publier une collection de concepts](#publier-collection)), l'ancienne version reste à disposition des applications clientes.

---

## <a id=envoyer-collection>Envoyer une collection de concepts</a>

L'envoi d'une collection de concepts est possible à partir de la page de description d'une collection.

- Cliquer sur le bouton <span style="color: blue">Envoyer</span> en haut au centre de l'écran de description de la collection.

Une nouvelle page s'affiche alors, permettant d'envoyer à un destinataire un message avec en pièce jointe la liste des concepts de la collection au format ODT, ainsi qu'un lien vers la page de la collection dans l'application. L'objet du message et le corps du texte peuvent être modifiés pour personnaliser l'envoi.

***NB : Ce service n'est pas relié à l'annuaire interne : il faut donc saisir l'adresse mail complète pour tous les destinataires.***

- Lorsque l'adresse mail du destinataire est renseignée et le texte prêt, cliquer en haut à droite sur le bouton <span style="color: blue">Envoyer</span> pour transmettre le mail.

---

## <a id="publier-collection">Publier une collection de concepts</a>

La publication d'un collection de concepts est possible à partir de la page de description d'une collection. Seul le propriétaire de la collection, ou par délégation l'unité Qualité (après échanges de mails), est habilité à publier une collection.

- Cliquer en haut à droite sur <span style="color: blue">Publier</span> après avoir vérifié les informations saisies.

---

# <a id="administration">Administration</a>

## <a id="suivre-concepts">Suivre l'activité du référentiel</a>

Le suivi de l'activité du référentiel est possible à partir de la page d'accueil <span style="color: blue">Administration</span> dans la barre horizontale de menu.

- Cliquer sur le pavé **Tableau de bord**.

En cliquant ensuite sur l'onglet <span style="color: blue">**Concepts**</span>, deux tableaux récapitulatif des concepts enregistrés dans la base à la date du jour s'affichent, dont un par propriétaire.

En cliquant sur l'onglet <span style="color: blue">**Collections**</span>, ce sont deux tableaux récapitulatifs des collections à la date du jour qui s'affichent.

Les onglets <span style="color: blue">**Liste des créations**</span> et <span style="color: blue">**Liste des modifications**</span> permettent de lister les créations et les modifications à partir d'une date à saisir dans la zone prévue à cet effet.

Les listes peuvent être triées en cliquant sur les titres des colonnes.
