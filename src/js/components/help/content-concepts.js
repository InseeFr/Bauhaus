import React from 'react';
import { Link } from 'react-router-dom';
import Tabs from 'js/components/shared/tabs';
import D from 'js/i18n';

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
						<span className="content-link">Naviguer dans les référentiels</span>,
						puis sur le pavé <span className="content-link">Concepts</span> ou{' '}
						<span className="content-link">Collections</span>
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
						d’accueil (onglet <span className="content-link">Concept</span> dans
						la barre horizontale de menu) ou à partir de la page de recherche
						avancée, qui permet de rechercher sur des critères.
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
						(onglet <span className="content-link">Concept</span> dans la barre
						horizontale de menu)
					</p>
					<p>
						Pour accéder à l’écran de création, cliquer sur l’option{' '}
						<span className="content-link">Nouveau</span> du menu à gauche.
					</p>
					<p>La première page de création du concept s’affiche.</p>
					<p>
						Le bouton <span className="content-link">Annuler</span> permet de
						revenir à la page d’accueil de l’onglet Concept.
					</p>
					<p>
						Le bouton <span className="content-link">Sauvegarder</span> permet
						d’enregistrer les données dans la base de gestion.
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
											<span className="content-link">Sauvegarder</span> devient
											actif après la saisie des champs obligatoires.
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
						bouton <span className="content-link">Envoyer</span>
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
						<span className="content-link">Envoyer</span>
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
						<span className="content-link">Valider</span> après avoir vérifié
						les informations saisies.
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
					<p>Body fr</p>
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
					<p>Body fr</p>
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
					<p>Body fr</p>
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
					<p>Body fr</p>
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
					<p>Body fr</p>
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
					<p>Body fr</p>
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
					<p>Body fr</p>
				</React.Fragment>
			),
			en: <p>Work in progress</p>,
		},
	},
	{
		id: 13,
		title: {
			fr: 'Modifier une collection de concepts',
			en: 'Modify a collection of concepts',
		},
		body: {
			fr: (
				<React.Fragment>
					<p>Body fr</p>
				</React.Fragment>
			),
			en: <p>Work in progress</p>,
		},
	},
	{
		id: 14,
		title: {
			fr: 'Valider une collection de concepts',
			en: 'Valid a collection of concepts',
		},
		body: {
			fr: (
				<React.Fragment>
					<p>Body fr</p>
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
					<p>Body fr</p>
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
					<p>Body fr</p>
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
					<p>Body fr</p>
				</React.Fragment>
			),
			en: <p>Work in progress</p>,
		},
	},
];
