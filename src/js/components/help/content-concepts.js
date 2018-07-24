import React from 'react';
import { Link } from 'react-router-dom';
import Tabs from 'js/components/shared/tabs';
import D from 'js/i18n';
import addLogo from 'js/components/shared/logo-add';
import delLogo from 'js/components/shared/logo-del';

export const content = [
	{
		id: 1,
		title: {
			fr: "Naviguer dans l'application",
			en: 'Run through the application',
		},
		body: {
			fr: (
				<React.Fragment>
					<p>La navigation se fait par la barre de menu en haut des pages.</p>
					<p>
						Pour arriver sur la page d’accueil cliquer sur{' '}
						<span className="content-back-color">
							Naviguer dans les référentiels
						</span>, puis sur le pavé{' '}
						<span className="content-back-color">Concepts</span> ou{' '}
						<span className="content-back-color">Collections</span>
					</p>
					<p>
						<i>
							Toute unité en ayant l’utilité peut demander la création d’un
							concept, mais afin de garantir l’intégrité et la qualité de la
							base, la création et la modification des concepts, ainsi que
							l’identification du propriétaire sont réservés à l’unité Qualité.
							La validation est de la responsabilité du propriétaire identifié
							et renseigné dans l’application, charge à lui éventuellement
							d’organiser la consultation avec d’autres utilisateurs. Dans
							l’application le propriétaire ou par délégation l’unité Qualité
							sont habilités à valider un concept.
						</i>
					</p>
					<p>
						<i>
							La création d’une collection de concepts peut être demandée à
							l’unité Qualité par toute unité ayant l’utilité de rassembler
							plusieurs concepts pour un usage particulier (par exemple
							documenter un ’nsee-Résultats). L’unité ayant fait la demande est
							l’unité propriétaire de la collection, qui peut regrouper des
							concepts dont elle n’est pas propriétaire. Un concept peut
							appartenir à plusieurs collections et être utilisé par plusieurs
							utilisateurs dans différentes collections. Le propriétaire d’une
							collection peut la modifier à tout moment. Dans l’application le
							propriétaire ou par délégation l’unité Qualité sont habilités à
							valider une collection.
						</i>
					</p>
					<p>
						Dans l’application, les habilitations sont attribuées en fonction
						des profils des utilisateurs.
					</p>
					<p>
						Quatre profils d’utilisateurs ont été définis quant à l’accès aux
						onglets et aux opérations du menu principal :
					</p>
					<ul>
						<li>
							<b>Administrateur de l’application</b> : accès à toutes les
							fonctionnalités ;
						</li>
						<li>
							<b>Propriétaire de collection de concepts</b> : consulter,
							modifier, valider et exporter une collection de concepts ;
						</li>
						<li>
							<b>Propriétaire de concepts</b> : consulter, valider et exporter
							un concept ;
						</li>
						<li>
							<b>Gestionnaire de l’ensemble des concepts</b> : créer et modifier
							un concept ou une collection, exporter un concept ou une
							collection ;
						</li>
						<li>
							<b>Invité</b> : consulter et exporter un concept ou une
							collection ;
						</li>
					</ul>
					<p>
						<b>
							Les boutons correspondant aux différentes fonctionnalités
							s’affichent en fonction du profil utilisateur.
						</b>
					</p>
					<p>
						Pour toute demande ou question, adresser un message à la boite
						fonctionnelle :
					</p>
					<p className="centered">
						<b>:DG75-Définitions et sources statistiques</b>
					</p>
				</React.Fragment>
			),
			en: <p>Work in progress</p>,
		},
	},
	{
		id: 'sub1',
		title: {
			fr: 'Concepts',
			en: 'Concepts',
		},
	},
	{
		id: 2,
		title: {
			fr: 'Rechercher un concept',
			en: 'Search a concept',
		},
		body: {
			fr: (
				<React.Fragment>
					<p>
						La recherche d’un concept peut se faire à partir de la page
						d’accueil (onglet{' '}
						<span className="content-back-color">Concept</span> dans la barre
						horizontale de menu) ou à partir de la page de recherche avancée,
						qui permet de rechercher sur des critères.
					</p>
					<p>La page d’accueil propose :</p>
					<ul>
						<li>
							un menu principal encadré à gauche de la page pour des opérations
							sur les concepts ;
						</li>
						<li>
							un moteur de recherche sur la totalité des concepts de
							l’application :{' '}
							<b>
								saisir une suite de caractères (pas forcément les premiers) du
								libellé ou du sigle ou nom court, ou synonyme.
							</b>
						</li>
					</ul>
					<p>
						L’application renvoie une liste en bas de page, éventuellement
						plusieurs pages. Pour réduire le liste, taper quelques caractères
						supplémentaires.
					</p>
					<p>
						Cliquer sur le concept recherché pour accéder à la page de
						description.
					</p>
					<p>
						En cliquant sur{' '}
						<Link to={`/concepts/search`}>Recherche avancée</Link>, vous pouvez
						affiner la sélection :
					</p>
					<p>
						<b>Saisir les filtres souhaités</b> dans les champs :
					</p>
					<ul>
						<li>
							<u>Libellé</u> : saisir une suite de caractères du nom du concept
						</li>
						<li>
							<u>Libellé alternatif</u> : saisir une suite de caractères du
							sigle ou acronyme, ou d’un synonyme
						</li>
						<li>
							<u>Recherche dans la définition</u> : saisir une suite de
							caractères du texte de la définition en français
						</li>
						<li>
							<u>Sélectionner un timbre</u> : choisir un timbre dans la liste
							pour obtenir la liste des concepts de la responsabilité de cette
							unité
						</li>
						<li>
							<u>Sélectionner un statut de diffusion</u> : choisir par statut :
							<ul>
								<li>Privé (usage interne)</li>
								<li>
									Public générique (publié à la rubrique Définitions sur
									insee.fr)
								</li>
								<li>
									Public spécifique (non publié à la rubrique Définitions, mais
									disponible pour documenter une publication, un produit)
								</li>
							</ul>
						</li>
						<li>
							<u>Sélectionner le statut de validation</u> : choisir parmi :
							<ul>
								<li>Validé (par le propriétaire)</li>
								<li>
									Provisoire (en cours de modification ou en attente de
									validation)
								</li>
							</ul>
						</li>
						<li>
							<u>Sélectionner les plages de date</u> de création ou de
							modification du concept recherché
						</li>
					</ul>
					<p>
						Cliquer sur le concept recherché pour accéder à la page de
						description.
					</p>
					<p>
						Pour voir la version anglaise, cocher la case en haut à gauche « <b>
							Afficher la seconde langue
						</b> ».
					</p>
				</React.Fragment>
			),
			en: <p>Work in progress</p>,
		},
	},
	{
		id: 3,
		title: { fr: 'Créer un concept', en: 'Create a concept' },
		body: {
			fr: (
				<React.Fragment>
					<p>
						<b>
							Avant de créer un concept, vérifier qu’il n’existe pas déjà en
							utilisant les fonctionnalités de recherche.
						</b>
					</p>
					<p>
						La création d’un concept se faire à partir de la page d’accueil
						(onglet <span className="content-back-color">Concept</span> dans la
						barre horizontale de menu)
					</p>
					<p>
						Pour accéder à l’écran de création, cliquer sur l’option{' '}
						<span className="content-back-color">Nouveau</span> du menu à
						gauche.
					</p>
					<p>La première page de création du concept s’affiche.</p>
					<p>
						Le bouton <span className="content-back-color">Annuler</span> permet
						de revenir à la page d’accueil de l’onglet Concept.
					</p>
					<p>
						Le bouton <span className="content-back-color">Sauvegarder</span>{' '}
						permet d’enregistrer les données dans la base de gestion.
					</p>
					<p>
						<b>
							La sauvegarde n’est pas possible tant que les champs obligatoires
							ne sont pas remplis
						</b>{' '}
						(champs marqués d’une <span className="boldRed">*</span>).
					</p>
					<Tabs
						tabs={[
							{
								id: 1,
								title: D.globalInformationsTitle,
								content: (
									<React.Fragment>
										<ul>
											<li>
												Le <b>« Libellé »</b> est le nom du concept :{' '}
												<b>
													le libellé français est obligatoire pour créer un
													concept.
												</b>
											</li>
											<li>
												Le <b>« Libellé alternatif »</b> est un autre libellé,
												un sigle ou un acronyme (ajout ou suppression de
												libellés en cliquant sur + ou - ).
											</li>
											<li>
												Le <b>« Propriétaire »</b> du concept est le timbre de
												l’unité responsable de la description du concept :le
												chef de l’unité a la responsabilité de valider les
												définitions et leur modifications.{' '}
												<b>
													Le timbre du « propriétaire » est obligatoire pour
													créer un concept
												</b>
											</li>
											<li>
												Le <b>« Gestionnaire »</b> est l’unité habilitée à créer
												/ modifier le concept : c’est l’unité Qualité
												(DG75-L201) qui assure la gestion des concepts.
											</li>
											<li>
												Le <b>« Statut de diffusion »</b> peut être :
												<ul>
													<li>
														Privé : la diffusion est réservée à un usage
														interne.
													</li>
													<li>
														Public générique : la diffusion est destinée à la
														rubrique « Définitions » de Insee.fr
													</li>
													<li>
														Public spécifique : la diffusion est restreinte à la
														documentation des publications et n’apparaît pas à
														la rubrique Définitions.
													</li>
												</ul>
											</li>
											<li>
												Un <b>« Document lié »</b> permet d’insérer un lien vers
												une page internet.
											</li>
											<li>
												<b>
													« Date de fin de validité » : ne doit pas être
													renseignée à la création
												</b>{' '}
												(une fois la date renseignée, dès lors que la date
												renseignée est atteinte, le concept ne peut plus être
												modifié).
											</li>
										</ul>
										<p>
											Le bouton{' '}
											<span className="content-back-color">Sauvegarder</span>{' '}
											devient actif après la saisie des champs obligatoires.
										</p>
									</React.Fragment>
								),
							},
							{
								id: 2,
								title: D.notesTitle,
								content: <React.Fragment>notes ...</React.Fragment>,
							},
							{
								id: 3,
								title: D.linksTitle,
								content: <React.Fragment>liens ...</React.Fragment>,
							},
						]}
					/>
				</React.Fragment>
			),
			en: <p>Work in progress</p>,
		},
	},
	{
		id: 4,
		title: {
			fr: 'Envoyer un concept',
			en: 'Send a concept',
		},
		body: {
			fr: (
				<React.Fragment>
					<p>
						Cliquer en haut à droite de l’écran de description du concept sur le
						bouton <span className="content-back-color">Envoyer</span>
					</p>
					<p>
						Un écran s’affiche, permettant d’envoyer à un destinataire un
						message avec en pièce jointe la description du concept en odt ainsi
						qu’un lien vers l’application. L’objet du message ainsi que le texte
						peuvent être modifiés pour personnaliser l’envoi.
					</p>
					<p>
						NB : le service n’est pas branché sur l’annuaire interne : il faut
						donc saisir l’adresse mail complète pour tous les destinataires.
					</p>
					<p>
						Lorsque l’adresse mail du destinataire est renseignée et le texte
						prêt, cliquer en haut à droite sur le bouton{' '}
						<span className="content-back-color">Envoyer</span>
					</p>
				</React.Fragment>
			),
			en: <p>Work in progress</p>,
		},
	},
	{
		id: 5,
		title: {
			fr: 'Valider un concept',
			en: 'Valid a concept',
		},
		body: {
			fr: (
				<React.Fragment>
					<p>
						Pour valider un concept, se positionner sur l’écran de description
						du concept à valider et cliquer en haut à droite sur{' '}
						<span className="content-back-color">Valider</span> après avoir
						vérifié les informations saisies.
					</p>
					<p>
						Pour rechercher les concepts à valider, utiliser la recherche
						avancée en sélectionnant{' '}
						<b>le statut de validation « Provisoire »</b> et éventuellement{' '}
						<b>le timbre</b>. La liste des concepts à valider s'affiche. Le
						concept ne peut être validé que par son propriétaire (i.e la
						personne désignée dans l’application comme ayant ce rôle pour un
						timbre donné) et par l’unité Qualité par délégation.{' '}
					</p>
				</React.Fragment>
			),
			en: <p>Work in progress</p>,
		},
	},
	{
		id: 6,
		title: {
			fr: 'Modifier un concept',
			en: 'Modify a concept',
		},
		body: {
			fr: (
				<React.Fragment>
					<p>
						Pour modifier un concept, rechercher le concept puis une fois sur
						l’écran de description, cliquer en haut à droite sur le bouton
						<span className="content-back-color">Modifier</span>
					</p>
					<p>Les différents champs peuvent alors être modifiés.</p>
					<p>Pour modifier les liens :</p>
					<ul>
						<li>
							pour ajouter des concepts liés, utiliser les boutons {addLogo}
						</li>
					</ul>
					<p>
						Pour trouver un concept dans la liste taper une chaîne de caractères
						contenue dans le libellé du concept recherché dans la boite de
						saisie au-dessus de la liste.
					</p>
					<ul>
						<li>
							pour enlever des concepts liés, utiliser les boutons {delLogo}
						</li>
					</ul>
					<p>
						Penser à <span className="content-back-color">Sauvegarder</span> la
						saisie avant de changer d’écran.
					</p>
					<p>
						NB : La définition courte est obligatoire pour pouvoir sauvegarder
						les modifications des concepts ayant un statut de diffusion « Public
						générique » ou « Public spécifique ».
					</p>
					<p>
						Une fois le concept modifié, son statut de validation devient
						<b>« provisoire », jusqu’à sa validation</b>. Tant qu’il n’est pas
						validé, c’est l’ancienne version qui est mise à disposition des
						applications clientes, et notamment publiée sur insee.fr.
					</p>
					<p>
						Pour valider, cliquer en haut à droite sur le bouton{' '}
						<span className="content-back-color">Valider</span>
					</p>
					<p>
						La modification des propriétés Définition courte, Définition et note
						éditoriale peuvent donner lieu à la création de nouvelles versions
						de ces notes, et donc du concept (voir{' '}
						<Link to={`/concepts/help/7`}>créer une nouvelle version</Link>).
					</p>
				</React.Fragment>
			),
			en: <p>Work in progress</p>,
		},
	},
	{
		id: 7,
		title: {
			fr: 'Créer une nouvelle version',
			en: 'Create new version',
		},
		body: {
			fr: (
				<React.Fragment>
					<p>
						Lorsque l’on modifie une définition, courte ou longue, ou la note
						éditoriale, au moment où l’on clique sur{' '}
						<span className="content-back-color">Sauvegarder</span> une boite de
						dialogue s’ouvre pour demander de choisir entre créer une nouvelle
						version ou écraser la version courante.
					</p>
					<p>
						Créer une nouvelle version permet de garder trace des définitions
						précédentes, de comparer ensuite les versions successives.{' '}
						<b>
							Dès lors que le changement de définition ou de note éditoriale
							n’est pas une simple correction de syntaxe ou d’orthographe, il
							faut créer une nouvelle version
						</b>{' '}
						pour permettre aux propriétaires successifs du concept de comprendre
						le cheminement qui a conduit à la définition courante.
					</p>
					<p>
						<b>
							La note de changement est obligatoire pour créer une nouvelle
							version de la définition
						</b>. C’est une note à usage interne : elle est destinée à garder
						trace de l’origine et du contexte des modifications.
					</p>
					<p>
						Pour continuer, renseigner la note de changement puis procéder aux
						modifications comme indiqué à la rubrique « <b>
							Modifier un concept
						</b> ».
					</p>
					<p>
						NB : le processus de versionnement ne s’active que lorsque l’on veut
						modifier un concept validé. Si le concept est en attente de
						validation (c’est-à-dire si son statut de validation est provisoire)
						les modifications successives ne donnent pas lieu à versionnement.
						Les nouvelles définitions et notes écrasent les anciennes.
					</p>
				</React.Fragment>
			),
			en: <p>Work in progress</p>,
		},
	},
	{
		id: 8,
		title: {
			fr: 'Comparer les versions ',
			en: 'Compare versions',
		},
		body: {
			fr: (
				<React.Fragment>
					<p>
						Lorsque plusieurs versions d’un concept existent, on peut les
						comparer en cliquant en haut à droite sur le bouton{' '}
						<span className="content-back-color">Comparer</span> de l’écran de
						description d’un concept. Un menu déroulant permet de sélectionner
						les versions que l’on souhaite comparer.
					</p>
					<p>Les deux versions sélectionnées s’affichent alors en vis à vis.</p>
					<p>
						Pour revenir à la version courante, cliquer en haut à gauche sur{' '}
						<span className="content-back-color">
							Revenir à la version courante
						</span>
					</p>
				</React.Fragment>
			),
			en: <p>Work in progress</p>,
		},
	},
	{
		id: 9,
		title: {
			fr: 'Exporter un ou plusieurs concepts',
			en: 'Export one or more concepts',
		},
		body: {
			fr: (
				<React.Fragment>
					<p>
						L’export de la description d’un ou plusieurs concepts se fait à
						partir de la page d’accueil des concepts : onglet{' '}
						<span className="content-back-color">Concepts</span> dans la barre
						horizontale de menu.
					</p>
					<p>
						Cliquer sur le bouton{' '}
						<span className="content-back-color">Exporter</span> à gauche de la
						page.
					</p>
					<p>
						Pour sélectionner les concepts à exporter, les faire glisser à
						l’aide du {addLogo} dans le bloc de gauche. Pour trouver un concept
						dans la liste taper une chaîne de caractères contenue dans le
						libellé du concept recherché dans la boite de saisie au-dessus de la
						liste.
					</p>
					<p>
						Une fois les concepts sélectionnés, cliquer sur{' '}
						<span className="content-back-color">Exporter</span> en haut à
						droite.
					</p>
					<p>
						Une boite de dialogue s’ouvre : choisir le format souhaité, PDF ou
						ODT. La fenêtre de téléchargement s’ouvre alors avec les options
						« ouvrir » et « enregistrer ». En cas d’export de plusieurs
						concepts, il y a autant de fichiers et de fenêtres de téléchargement
						que de concepts exportés.
					</p>
					<p>
						<i>
							NB : le format ODT permet d’échanger avec des interlocuteurs pour
							la mise au point d’une définition, le format PDF est à usage
							d’information.
						</i>
					</p>
				</React.Fragment>
			),
			en: <p>Work in progress</p>,
		},
	},
	{
		id: 'sub2',
		title: {
			fr: 'Collections de concepts',
			en: 'Collections of concepts',
		},
	},
	{
		id: 10,
		title: {
			fr: 'Rechercher une collection de concepts',
			en: 'Search a collection of concepts',
		},
		body: {
			fr: (
				<React.Fragment>
					<p>
						La recherche d’une collection se faire à partir de la page d’accueil
						(onglet <span className="content-back-color">Collections</span> de
						la barre horizontale de menu).
					</p>
					<p>
						<b>
							Saisir une suite de caractères (pas forcément les premiers) du
							libellé de la collection.
						</b>
					</p>
					<p>
						Cliquer sur la collection recherchée pour accéder à la page de
						description.
					</p>
					<p>
						Pour voir la version anglaise, cocher la case en haut à gauche « <b>
							Afficher la seconde langue
						</b> ».
					</p>
				</React.Fragment>
			),
			en: <p>Work in progress</p>,
		},
	},
	{
		id: 11,
		title: {
			fr: 'Créer une collection de concepts',
			en: 'Create a collection of concepts',
		},
		body: {
			fr: (
				<React.Fragment>
					<p>
						La création d’une collection de concepts se fait à partir de la page
						d’accueil (onglet{' '}
						<span className="content-back-color">Collections</span> dans la
						barre horizontale de menu).
					</p>
					<p>
						Pour accéder à l’écran de création, cliquer sur l’option{' '}
						<span className="content-back-color">Nouvelle</span> du menu à
						gauche. La page de création de la collection s’affiche.
					</p>
					<p>
						Le bouton <span className="content-back-color">Annuler</span> permet
						de revenir à la page d’accueil de l’onglet Collections .
					</p>
					<p>
						Le bouton <span className="content-back-color">Sauvegarder</span>{' '}
						permet d’enregistrer les données dans la base de gestion.
					</p>
					<p>
						<b>
							La sauvegarde n’est pas possible tant que les champs obligatoires
							ne sont pas remplis
						</b>{' '}
						(champs marqués d’une <span className="boldRed">*</span>).
					</p>
					<p>
						Pour sélectionner les concepts à inclure dans la collection les
						faire glisser à l’aide du {addLogo} du bloc de droite vers le bloc
						de gauche. Pour trouver un concept dans la liste taper une chaîne de
						caractères contenue dans le libellé du concept recherché dans la
						boite de saisie au-dessus de la liste.
					</p>
					<p>
						Penser à <span className="content-back-color">Sauvegarder</span> les
						informations saisies en cliquant sur le bouton en haut à gauche
						avant de changer d’écran.
					</p>
					<p>
						La sauvegarde n’entraîne pas la publication de la collection. La
						collection doit au préalable avoir été validé par son propriétaire
						ou par délégation (après échanges de mails) par l’unité Qualité . Il
						est donc possible de créer la collection en plusieurs étapes si
						c’est nécessaire : par exemple compléter la liste des concepts à
						inclure dans un deuxième temps.
					</p>
					<p>
						Le statut de la collection est alors{' '}
						<b>« provisoire », jusqu’à sa validation</b>.
					</p>
				</React.Fragment>
			),
			en: <p>Work in progress</p>,
		},
	},
	{
		id: 12,
		title: {
			fr: 'Envoyer une collection de concepts',
			en: 'Send a collection of concepts',
		},
		body: {
			fr: (
				<React.Fragment>
					<p>
						Cliquer en haut à gauche de l’écran de description de la collection
						sur le bouton <span className="content-back-color">Envoyer</span>
					</p>
					<p>
						Un écran s’affiche, permettant d’envoyer à un destinataire un
						message avec en pièce jointe la liste des concepts de la collection
						au format odt, ainsi qu’un lien vers l’application. L’objet du
						message ainsi que le texte peuvent être modifiés pour personnaliser
						l’envoi.
					</p>
					<p>
						NB : le service n’est pas branché sur l’annuaire interne : il faut
						donc saisir l’adresse mail complète pour tous les destinataires.
					</p>
					<p>
						Lorsque l’adresse mail du destinataire est renseignée et le texte
						prêt, cliquer sur le bouton{' '}
						<span className="content-back-color">Envoyer</span>
					</p>
				</React.Fragment>
			),
			en: <p>Work in progress</p>,
		},
	},
	{
		id: 13,
		title: {
			fr: 'Valider une collection de concepts',
			en: 'Valid a collection of concepts',
		},
		body: {
			fr: (
				<React.Fragment>
					<p>
						Pour valider une collection de concepts, se positionner sur l’écran
						de description de la collection à valider et cliquer en haut à
						droite sur <span className="content-back-color">Valider</span> après
						avoir vérifié les informations saisies.
					</p>
				</React.Fragment>
			),
			en: <p>Work in progress</p>,
		},
	},
	{
		id: 14,
		title: {
			fr: 'Modifier une collection de concepts',
			en: 'Modify a collection of concepts',
		},
		body: {
			fr: (
				<React.Fragment>
					<p>
						Pour modifier une collection de concepts, rechercher la collection
						puis une fois sur l’écran de description de la collection , cliquer
						sur le bouton <span className="content-back-color">Modifier</span>
					</p>
					<p>Les différents champs peuvent alors être modifiés.</p>
					<p>Pour modifier la composition de la collection :</p>
					<ul>
						<li>pour ajouter des concepts, utiliser les boutons {addLogo}</li>
						<li>pour enlever des concepts, utiliser les boutons {delLogo}</li>
					</ul>
					<p>
						Penser à <span className="content-back-color">Sauvegarder</span> la
						saisie avant de changer d’écran.
					</p>
					<p>
						Une fois la collection modifiée, son statut de validation devient
						<b>« provisoire » jusqu’à sa validation</b>. Tant qu’il n’est pas
						validé, c’est l’ancienne version qui est mise à disposition des
						éventuelles applications clientes.
					</p>
				</React.Fragment>
			),
			en: <p>Work in progress</p>,
		},
	},
	{
		id: 15,
		title: {
			fr: 'Exporter une collection de concepts',
			en: 'Export one or more collections of concepts',
		},
		body: {
			fr: (
				<React.Fragment>
					<p>
						L’export de la liste des concepts d’une collection se fait à partir
						de la page d'accueil Collection : onglet{' '}
						<span className="content-back-color">Collections</span> dans la
						barre horizontale de menu.
					</p>
					<p>
						Cliquer sur le bouton{' '}
						<span className="content-back-color">Exporter</span> à gauche de la
						page.
					</p>
					<p>
						Pour sélectionner la ou les collections à exporter les faire glisser
						à l’aide du {addLogo} dans le bloc de gauche. Pour trouver une
						collection dans la liste taper une chaîne de caractères contenue
						dans le libellé du concept recherché dans la boite de saisie
						au-dessus de la liste.
					</p>
					<p>
						Une fois la ou les collections sélectionnées, cliquer sur{' '}
						<span className="content-back-color">Exporter</span>
						en haut à droite.
					</p>
					<p>
						Une boite de dialogue s’ouvre : choisir le format souhaité, PDF ou
						ODT. La fenêtre de téléchargement s’ouvre alors avec les options
						« ouvrir » et « enregistrer ». En cas d’export de plusieurs
						collections, il y a autant de fichiers et de fenêtres de
						téléchargement que de collections exportées.
					</p>
				</React.Fragment>
			),
			en: <p>Work in progress</p>,
		},
	},
	{
		id: 'sub3',
		title: {
			fr: 'Administration',
			en: 'Administration',
		},
	},
	{
		id: 16,
		title: {
			fr: 'Suivre l’activité du référentiel',
			en: 'Track repository activity',
		},
		body: {
			fr: (
				<React.Fragment>
					<p>
						Pour suivre l’activité du référentiel cliquer sur le pavé{' '}
						<b>Tableau de bord</b> dans l’onglet{' '}
						<span className="content-back-color">Administration</span> de la
						barre de menus horizontale.
					</p>
					<p>
						En cliquant sur l’onglet{' '}
						<span className="content-color">Concepts</span> de la page, deux
						tableaux récapitulatif des concepts contenus de la base à la date du
						jour s’affichent, dont l’un par propriétaire.
					</p>
					<p>
						En cliquant sur l’onglet{' '}
						<span className="content-color">Collections</span> de la page, ce
						sont deux tableaux récapitulatifs des collections à la date du jour
						qui s’affichent.
					</p>
					<p>
						Les onglets{' '}
						<span className="content-color">Liste des créations</span> et{' '}
						<span className="content-color">Liste des modifications</span>{' '}
						permettent de lister les créations et modifications à partir d’une
						date à saisir dans la zone prévue à cet effet.
					</p>
					<p>
						Les listes peuvent être triées en cliquant sur les titres des
						colonnes.
					</p>
				</React.Fragment>
			),
			en: <p>Work in progress</p>,
		},
	},
	{
		id: 17,
		title: {
			fr: 'Attribuer les rôles aux utilisateurs',
			en: 'Assign roles to users',
		},
		body: {
			fr: (
				<React.Fragment>
					<p>
						La gestion des habilitations se fait en cliquant sur le pavé{' '}
						<b>Gestion des habilitations</b> dans l’onglet{' '}
						<span className="content-back-color">Administration</span> de la
						barre de menus horizontale.
					</p>
					<p>
						La liste des utilisateurs -ayant un rôle autre qu’invité- avec leur
						rôle s’affiche. Pour rechercher une personne, taper une suite de
						caractères de son nom ou prénom dans la boite à droite au-dessus du
						tableau.
					</p>
					<p>
						Pour modifier cette liste, cliquer sur le bouton{' '}
						<span className="content-back-color">Modifier</span> en haut à
						droite de la page.
					</p>
					<ul>
						<li>pour ajouter des personnes, utiliser les boutons {addLogo}</li>
					</ul>
					<p>
						Pour trouver une personne dans liste taper une chaîne de caractères
						contenue dans le nom ou prénom de la personne recherchée dans la
						boite de saisie au-dessus de la liste.
					</p>
					<ul>
						<li>pour enlever des personnes, utiliser les boutons {delLogo}</li>
						<li>
							pour attribuer un rôle à une personne ajoutée, choisir dans la
							liste déroulante au-dessus.
						</li>
						<li>
							pour modifier le rôle d’une personne, la supprimer de la liste,
							puis l’ajouter en choisissant son nouveau rôle dans la liste
							déroulante.
						</li>
					</ul>
				</React.Fragment>
			),
			en: <p>Work in progress</p>,
		},
	},
];
