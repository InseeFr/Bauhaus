
# Guide utilisateur du module Nomenclatures de Bauhaus
Version au 01/02/2021

Le module Nomenclatures encore appelé "Bauhaus-Nomenclatures" permet de consulter les nomenclatures utiles à des fins statistiques et à terme de les gérer (création/modification).

---

## Sommaire

- [**Naviguer dans l'application**](#naviguer)
- [**Familles/Séries/Nomenclatures/Tables de correspondances**](#Familles-series-nomenclatures)

- [**Fonctionnalités de gestion des Nomenclatures**](#fonctionnalites-nomenclatures)

  - [Rechercher une nomenclature](#rechercher-nomenclature)
  - [Naviguer au sein d'une nomenclature](#naviguer-nomenclature)
  - [Rechercher une table de correspondances](#rechercher-correspondance)
  - [Naviguer au sein d'une table de correspondances](#naviguer-correspondance)  
  - [Export des données de Bauhaus-Nomenclatures](#exporter)

---

## <a id="naviguer">Naviguer dans l'application</a>

Pour atteindre la page d'accueil du module de gestion des nomenclatures, cliquer sur le pavé <span style="color: blue">Nomenclatures</span> de la page d'accueil.
La navigation se fait via la barre horizontale de menu en haut de la page.

Toute unité en ayant l'utilité peut demander la création ou la modification d'une nomenclature à l'équipe RMéS via la boîte fonctionnelle dg75-administration-rmes@insee.fr. L'application Bauhaus de gestion des nomenclatures ne permet actuellement que la consultation des nomenclatures. Les créations de nomenclature sont gérées par un batch se basant sur un fichier Calc dûment renseigné. Les mises à jour sont réalisées manuellement par l'équipe informatique RMéS sur la base de spécifications de mise à jour validées par le propriétaire de la nomenclature. 

---
## <a id="Familles-series-nomenclatures">Familles/Séries/Nomenclatures/Tables de correspondances</a>
La barre horizontale de menu en haut de la page mentionne les rubriques Familles/Séries/Nomenclatures/Tables de correspondance qui permettent de naviguer respectivement par famille, série ou au sein de l'ensemble des nomenclatures ou tables de correspondances actuellement stockées dans RMéS pour les consulter.
![](images/barrehorizontale.png)

---

Dans Familles, on distingue 5 familles de nomenclatures : administratives, économiques, géographiques, juridiques et sociales. 
Dans Séries, on distingue actuellement COICOP, CPF, NAF, CJ, PCS.
Dans Nomenclatures, on accède à la consultation de l'ensemble des Nomenclatures stockées dans RMéS.
Dans Tables de correspondances, on accède à la consultation de l'ensemble des tables de correspondances stockées dans RMéS.

---

## <a id="fonctionnalites-nomenclatures">Fonctionnalités de gestion des nomenclatures</a>

### <a id="rechercher-nomenclature">Rechercher une nomenclature</a>

La page Nomenclatures, accessible à partir de la barre horizontale de menu, propose une barre de recherche pour rechercher parmi les titres des nomenclatures disponibles. On peut également sélectionner une nomenclature en cliquant sur l'hyperlien de son titre au sein de la liste des nomenclatures située sous la barre de recherche.



### <a id="consulter-nomenclature">Consulter une nomenclature</a>

Si on sélectionne par exemple, la "Nomenclature d'activités française - NAF rév. 2", on consulte alors les informations concernant l'ensemble de la nomenclature organisées au sein de différentes rubriques dédiées telle que Informations générales, Texte descriptif court, Remarque, Note de changement. 

---

Pour accéder au détail des postes d'une nomenclature, deux possibilités : 
-une barre de recherche en haut de l'écran nous permet d'accéder à l'ensemble des postes trié par niveau croissant et par ordre alphabétique du code du poste. Le clic sur un des postes de la liste permet de consulter son contenu, organisé au sein de différentes rubriques dédiées ;
-une liste en bas de page de l'ensemble des niveaux de la nomenclature et au clic sur l'un des niveaux : accès aux informations générales du niveau et à l'ensemble des postes du niveau sélectionné.

Pour chaque poste, des hyperliens permettent d'accéder facilement au niveau supérieur ou aux niveaux inférieurs du poste.

On trouve sur tous les écrans de consultation une case à cocher "Afficher la seconde langue" qui permet d'afficher les informations en anglais si elles existent.

---
### <a id="rechercher-correspondance">Rechercher une table de correspondances</a>

La page Tables de correspondance, accessible à partir de la barre horizontale de menu, propose une barre de recherche pour rechercher parmi les titres des tables de correspondances disponibles. On peut également sélectionner une table de correspondances en cliquant sur l'hyperlien de son titre au sein de la liste des tables située sous la barre de recherche.



### <a id="consulter-correspondance">Consulter une table de correspondances</a>
Si on sélectionne par exemple, la "table de correspondance Naf rév. 2 / Cpf rév. 2.1", on consulte alors les informations générales de la table suivies de la liste des associations répertoriées assortie d'une barre de recherche.

---

### <a id="export">Export des données de Bauhaus-Nomenclatures</a>


On notera qu'il n'existe pas actuellement d'export des informations consultables via Bauhaus-Nomenclatures mais qu'il existe cependant sur api.insee.fr une API Nomenclatures permettant de réaliser l'export de ces informations au format json ou xml.
