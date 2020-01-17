
# Guide utilisateur du module Concepts de Bauhaus
Version au 01/01/2020

## Sommaire

- [**Naviguer dans l'application**](#naviguer)

- [**Fonctionnalités du module Concepts**](#fonctionnalites-concepts)

  - [Rechercher un concept](#rechercher-concept)
  - [Exporter un ou plusieurs concepts](#exporter-concept)
  - [Créer un concept](#creer-concept)
  - [Modifier un concept](#modifier-concept)
  - [Créer une nouvelle version](#creer-version-concept)
  - [Comparer les versions](#comparer-versions)
  - [Envoyer un concept](#envoyer-concept)
  - [Publier un concept](#publier-concept)

---

- [**Collection de concepts**](#collection-concepts)

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

Pour arriver sur la page d'accueil cliquer sur le pavé Concepts de la page d'accueil.
La navigation se fait par la barre de menu en haut de la page.

*Toute unité en ayant l'utilité peut demander la création d'un concept, mais afin de garantir l'intégrité et la qualité de la base, la création et la modification des concepts, ainsi que l'identification du propriétaire sont réservés à l'unité Qualité. La publication est de la responsabilité du propriétaire identifié et renseigné dans l'application, charge à lui éventuellement d'organiser la consultation avec d'autres utilisateurs. Dans l'application, l'unité Qualité est habilitée à publier un concept sur demande du propriétaire.*

*La création d'une collection de concepts peut être demandée à l'unité Qualité par toute unité ayant l'utilité de rassembler plusieurs concepts pour un usage particulier (par exemple documenter un Insee-Résultats). L'unité ayant fait la demande est l'unité propriétaire de la collection, qui peut regrouper des concepts dont elle n'est pas propriétaire. Un concept peut appartenir à plusieurs collections et être utilisé par plusieurs utilisateurs dans différentes collections. Le propriétaire d'une collection peut la modifier à tout moment. Dans l'application, l'unité qualité est habilitée à publier une collection sur demande du propriétaire.*

Dans l'application, les habilitations sont attribuées en fonction des profils des utilisateurs.

Quatre grands profils d'utilisateurs ont été définis quant à l'accès aux fonctionnalités de l'application :

   - Administrateur de l'application : accès à toutes les fonctionnalités ;
   - Gestionnaire de l'ensemble des concepts : rechercher, exporter, créer, modifier, envoyer, publier un concept ou une collection et comparer les versions des caractéristiques d'un concept ;
   - Propriétaire de collection de concepts : rechercher, exporter, créer, modifier, envoyer, publier une collection ;
   - Invité (profil par défaut pour tout utilisateur se connectant à l'application) : rechercher, exporter, envoyer un concept ou une collection et comparer les versions des caractéristiques d'un concept ;

**Les boutons correspondant aux différentes fonctionnalités s'affichent en fonction du profil utilisateur.**

Pour toute demande ou question, adresser un message à la boite fonctionnelle :

**:DG75-Administration RMéS**

---

## <a id="fonctionnalites-concepts">Fonctionnalités du module Concepts</a>

### <a id="rechercher-concept">Rechercher un concept</a>

La recherche d'un concept peut se faire :

- soit à partir de la page d'accueil Concepts (1)
- soit à partir de la page de recherche avancée, qui permet de rechercher sur différents critères (2)

1. La page d'accueil propose un moteur de recherche sur la totalité des concepts de l'application : **saisir une suite de caractères (pas forcément les premiers) du libellé, du sigle, du nom court ou du synonyme.**

L'application renvoie une liste en bas de page, éventuellement plusieurs pages. Pour réduire le liste, entrer quelques caractères supplémentaires.

Cliquer sur le concept recherché pour accéder à la page de description.
Pour consulter la version anglaise, cocher la case 
- [ ] **Afficher la seconde langue**.

2. La recherche avanacée est disponible en cliquant sur <span style="color: blue">**Recherche avancée**</span>, vous pouvez affiner la sélection :

- **Saisir les filtres souhaités** dans les champs :

  - *Libellé* : saisir une suite de caractères du nom du concept
  - *Libellé alternatif* : saisir une suite de caractères du sigle ou acronyme, ou d'un synonyme
  - *Recherche dans la définition* : saisir une suite de caractères du texte de la définition en français
  - *Sélectionner un timbre* : choisir un timbre dans la liste pour obtenir la liste des concepts de la responsabilité de cette unité
  - *Sélectionner un statut de diffusion* : choisir par statut :
    - Privé (usage interne)
    - Public générique (publié à la rubrique Définitions sur insee.fr)
  - Public spécifique (non publié à la rubrique Définitions, mais disponible pour documenter une publication, un produit)
  - *Sélectionner le statut de publication* : choisir parmi :
    - Publié
    - Provisoire (en cours de modification ou en attente de publication)
  - *Sélectionner les plages de date de création ou de modification* du concept recherché

- Cliquer sur le concept recherché pour accéder à la page de description.

Pour consulter la version anglaise, cocher la case
- [ ] **Afficher la seconde langue**.

---

## <a id="exporter-concept">Exporter un ou plusieurs concepts</a>

L'export de la description d'un ou plusieurs concepts est disponible à partir de la page d'accueil du module Concepts.

- Cliquer sur le bouton <span style="color: blue">Exporter</span> à gauche de la page.

- Sélectionner les concepts à exporter en les faisant glisser du bloc de droite au bloc de gauche à l'aide du bouton ![4%](images/add.png).
Vous pouvez également rechercher un concept dans la liste en entrant une chaîne de caractères contenue dans le libellé du concept dans la zone de saisie au-dessus de la liste.

- Une fois les concepts sélectionnés, cliquer sur <span style="color: blue">Exporter</span> en haut à droite. 
Une boite de dialogue s'ouvre.

- Choisir le format souhaité, PDF ou ODT.
La fenêtre de téléchargement s'ouvre alors avec les options « ouvrir » et « enregistrer ». En cas d'export de plusieurs concepts, il y a autant de fichiers et de fenêtres de téléchargement que de concepts exportés.

*NB : le format ODT permet d'échanger avec des interlocuteurs pour la mise au point d'une définition, le format PDF est à usage d'information.*

---

## <a id="envoyer-concept">Envoyer un concept</a>

L'envoi d'un concept est disponible à partir de la page de description d'un concept.

- Cliquer en haut à droite de l'écran de description du concept sur le bouton <span style="color: blue">Envoyer</span>
Un écran s'affiche, permettant d'envoyer à un destinataire un message avec en pièce jointe la description du concept en odt ainsi qu'un lien vers l'application. L'objet du message ainsi que le texte peuvent être modifiés pour personnaliser l'envoi.

NB : le service n'est pas branché sur l'annuaire : il faut donc saisir l'adresse mail complète pour tous les destinataires.

- Lorsque l'adresse mail du destinataire est renseignée et le texte prêt, cliquer en haut à droite sur le bouton <span style="color: blue">Envoyer</span>

---

## <a id="creer-concept">Créer un concept</a>

**Avant de créer un concept, vérifier qu'il n'existe pas déjà en utilisant les fonctionnalités de recherche.**

La création d'un concept est disponible à partir de la page d'accueil du module Concepts.

- Cliquer sur l'option <span style="color: blue">Nouveau</span> du menu à gauche.
La première page de création du concept s'affiche.
Le bouton <span style="color: blue">Annuler</span> permet de revenir à la page d'accueil de l'onglet Concept.
Le bouton <span style="color: blue">Sauvegarder</span> permet d'enregistrer les données dans la base de gestion.

**NB : La sauvegarde n'est pas possible tant que les champs obligatoires ne sont pas remplis** (champs marqués d'une *).

    Informations générales    Notes    Liens

   - Le « Libellé » est le nom du concept : le libellé français est obligatoire pour créer un concept.
   - Le « Libellé alternatif » est un autre libellé, un sigle ou un acronyme (ajout ou suppression de libellés en cliquant sur + ou - ).
   - Le « Propriétaire » du concept est le timbre de l'unité responsable de la description du concept :le chef de l'unité a la responsabilité de publier les définitions et leur modifications. Le timbre du « propriétaire » est obligatoire pour créer un concept
    - Le « Gestionnaire » est l'unité habilitée à créer / modifier le concept : c'est l'unité Qualité (DG75-L201) qui assure la gestion des concepts.
    - Le « Statut de diffusion » peut être :
        - Privé : la diffusion est réservée à un usage interne.
        - Public générique : la diffusion est destinée à la rubrique « Définitions » de Insee.fr
        - Public spécifique : la diffusion est restreinte à la documentation des publications et n'apparaît pas à la rubrique Définitions.
    - Un « Document lié » permet d'insérer un lien vers une page internet.
    - « Date de fin de validité » : ne doit pas être renseignée à la création (une fois la date renseignée, dès lors que la date renseignée est atteinte, le concept ne peut plus être modifié).

Le bouton <span style="color: blue">Sauvegarder</span> devient actif après la saisie des champs obligatoires.

Penser à sauvegarder les informations saisies en cliquant sur le bouton en haut à gauche avant de changer d'écran.

La sauvegarde n'entraîne pas la publication du concept. Il doit au préalable avoir été publié par son propriétaire ou par délégation (après échanges de mails) par l'unité Qualité . Il est donc possible de créer le concept en plusieurs étapes si c'est nécessaire.

Le statut de publication du concept est alors **« provisoire », jusqu'à sa publication.**

Pour envoyer la description du concept par mail à un interlocuteur (en particulier à son propriétaire) cliquer en haut à droite sur le bouton Envoyer

Pour publier, cliquer en haut à gauche de l'écran de description du concept sur le bouton Publier.

---

## <a id="modifier-concept">Modifier un concept</a>

La modification d'un concept est disponible à partir de la page de description d'un concept.

- Cliquer en haut à droite sur le bouton <span style="color: blue">Modifier</span>
Les différents champs peuvent alors être modifiés.

Pour modifier les liens :
   - pour ajouter des concepts liés, utiliser les boutons ![4%](images/add.png)

Pour trouver un concept dans la liste taper une chaîne de caractères contenue dans le libellé du concept recherché dans la boite de saisie au-dessus de la liste.
   - pour retirer des concepts liés, utiliser les boutons ![4%](images/del.png)

Penser à Sauvegarder la saisie avant de changer d'écran.

NB : La définition courte est obligatoire pour pouvoir sauvegarder les modifications des concepts ayant un statut de diffusion « Public générique » ou « Public spécifique ».

- Une fois le concept modifié, son statut de publication devient **« provisoire », jusqu'à sa publication**. Tant qu'il n'est pas publié, c'est l'ancienne version qui est mise à disposition des applications clientes, et notamment publiée sur insee.fr.

La modification des propriétés Définition courte, Définition et note éditoriale peuvent donner lieu à la création de nouvelles versions de ces notes, et donc du concept (voir créer une nouvelle version).

---

## <a id="creer-version-concept">Créer une nouvelle version</a>

Lorsque l'on [modifie](#modifier-concept) une définition, courte ou longue, ou la note éditoriale, au moment où l'on clique sur Sauvegarder une boite de dialogue s'ouvre pour demander de choisir entre créer une nouvelle version ou écraser la version courante.

- Créer une nouvelle version permet de garder trace des définitions précédentes, de comparer ensuite les versions successives. **Dès lors que le changement de définition ou de note éditoriale n'est pas une simple correction de syntaxe ou d'orthographe, il faut créer une nouvelle version** pour permettre aux propriétaires successifs du concept de comprendre le cheminement qui a conduit à la définition courante.

**La note de changement est obligatoire pour créer une nouvelle version de la définition.** C'est une note à usage interne : elle est destinée à garder trace de l'origine et du contexte des modifications.

- Pour continuer, renseigner la note de changement puis procéder aux modifications comme indiqué à la rubrique **« Modifier un concept »**.

NB : le processus de versionnement ne s'active que lorsque l'on veut modifier un concept publié. Si le concept est en attente de publication (c'est-à-dire si son statut de publication est provisoire) les modifications successives ne donnent pas lieu à versionnement. Les nouvelles définitions et notes écrasent les anciennes.

---

## <a id="comparer-versions">Comparer les versions d'un concept</a>

Lorsque plusieurs versions d'un concept existent, on peut les comparer en cliquant en haut à droite sur le bouton Comparer de l'écran de description d'un concept. Un menu déroulant permet de sélectionner les versions que l'on souhaite comparer.

- Les deux versions sélectionnées s'affichent alors en vis à vis.

- Pour revenir à la version courante, cliquer en haut à gauche sur <span style="color: blue">Revenir à la version courante</span>.

---

## <a id="publier-concept">Publier un concept</a>

Pour publier un concept, se positionner sur l'écran de description du concept à publier

- cliquer en haut à droite sur Publier après avoir vérifié les informations saisies.

Pour rechercher les concepts à publier, utiliser la recherche avancée en sélectionnant **le statut de publication « Provisoire »** et éventuellement **le timbre**. La liste des concepts à publier s'affiche. Le concept ne peut être publié que par son propriétaire (i.e la personne désignée dans l'application comme ayant ce rôle pour un timbre donné) et par l'unité Qualité par délégation.

---

# <a id="collection-concepts">Collection de concepts</a>

## <a id="rechecher-collection">Rechercher une collection de concepts</a>

La recherche d'une collection se faire à partir de la page d'accueil (onglet Collections de la barre horizontale de menu).

**Saisir une suite de caractères (pas forcément les premiers) du libellé de la collection.**

Cliquer sur la collection recherchée pour accéder à la page de description.

Pour voir la version anglaise, cocher la case en haut à gauche **« Afficher la seconde langue »**.

---

## <a id="exporter-collection">Exporter une collection de concepts</a>

L'export de la liste des concepts d'une collection se fait à partir de la page d'accueil Collection : onglet Collections dans la barre horizontale de menu.

- Cliquer sur le bouton <span style="color: blue">Exporter</span> à gauche de la page.

- Pour sélectionner la ou les collections à exporter les faire glisser à l'aide du add dans le bloc de gauche. Pour trouver une collection dans la liste taper une chaîne de caractères contenue dans le libellé du concept recherché dans la boite de saisie au-dessus de la liste.

- Une fois la ou les collections sélectionnées, cliquer sur <span style="color: blue">Exporter</span> en haut à droite.

- Une boite de dialogue s'ouvre : choisir le format souhaité, PDF ou ODT. La fenêtre de téléchargement s'ouvre alors avec les options « ouvrir » et « enregistrer ». En cas d'export de plusieurs collections, il y a autant de fichiers et de fenêtres de téléchargement que de collections exportées.

---

## <a id="creer-collection">Créer une collection de concepts</a>

La création d'une collection de concepts se fait à partir de la page d'accueil (onglet Collections dans la barre horizontale de menu).

Pour accéder à l'écran de création, cliquer sur l'option Nouvelle du menu à gauche. La page de création de la collection s'affiche.

Le bouton Annuler permet de revenir à la page d'accueil de l'onglet Collections .

Le bouton Sauvegarder permet d'enregistrer les données dans la base de gestion.

**La sauvegarde n'est pas possible tant que les champs obligatoires ne sont pas remplis** (champs marqués d'une *).

Pour sélectionner les concepts à inclure dans la collection les faire glisser à l'aide du add du bloc de droite vers le bloc de gauche. Pour trouver un concept dans la liste taper une chaîne de caractères contenue dans le libellé du concept recherché dans la boite de saisie au-dessus de la liste.

Penser à Sauvegarder les informations saisies en cliquant sur le bouton en haut à gauche avant de changer d'écran.

La sauvegarde n'entraîne pas la publication de la collection. La collection doit au préalable avoir été publié par son propriétaire ou par délégation (après échanges de mails) par l'unité Qualité . Il est donc possible de créer la collection en plusieurs étapes si c'est nécessaire : par exemple compléter la liste des concepts à inclure dans un deuxième temps.

Le statut de la collection est alors **« provisoire », jusqu'à sa publication**.

---

## <a id="modifier-collection">Modifier une collection de concepts</a>

Pour modifier une collection de concepts, rechercher la collection puis une fois sur l'écran de description de la collection , cliquer sur le bouton Modifier

Les différents champs peuvent alors être modifiés.

Pour modifier la composition de la collection :

   - pour ajouter des concepts, utiliser les boutons add
   - pour enlever des concepts, utiliser les boutons delete

Penser à Sauvegarder la saisie avant de changer d'écran.

Une fois la collection modifiée, son statut de publication devient **« provisoire » jusqu'à sa publication**. Tant qu'il n'est pas publié, c'est l'ancienne version qui est mise à disposition des éventuelles applications clientes.

---

## <a id=envoyer-collection>Envoyer une collection de concepts</a>

Cliquer en haut à gauche de l'écran de description de la collection sur le bouton Envoyer

Un écran s'affiche, permettant d'envoyer à un destinataire un message avec en pièce jointe la liste des concepts de la collection au format odt, ainsi qu'un lien vers l'application. L'objet du message ainsi que le texte peuvent être modifiés pour personnaliser l'envoi.

NB : le service n'est pas branché sur l'annuaire interne : il faut donc saisir l'adresse mail complète pour tous les destinataires.

Lorsque l'adresse mail du destinataire est renseignée et le texte prêt, cliquer sur le bouton Envoyer.

---

## <a id="publier-collection">Publier une collection de concepts</a>

Pour publier une collection de concepts, se positionner sur l'écran de description de la collection à publier et cliquer en haut à droite sur Publier après avoir vérifié les informations saisies.

---

# <a id="administration">Administration</a>

## <a id="suivre-concepts">Suivre l'activité du référentiel</a>

Pour suivre l'activité du référentiel cliquer sur le pavé **Tableau de bord** dans l'onglet Administration de la barre de menus horizontale.

En cliquant sur l'onglet <span style="color: blue">**Concepts**</span> de la page, deux tableaux récapitulatif des concepts contenus de la base à la date du jour s'affichent, dont l'un par propriétaire.

En cliquant sur l'onglet <span style="color: blue">**Collections**</span> de la page, ce sont deux tableaux récapitulatifs des collections à la date du jour qui s'affichent.

Les onglets <span style="color: blue">**Liste des créations**</span> et <span style="color: blue">**Liste des modifications**</span> permettent de lister les créations et modifications à partir d'une date à saisir dans la zone prévue à cet effet.

Les listes peuvent être triées en cliquant sur les titres des colonnes.
