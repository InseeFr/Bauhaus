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
					<p>
						4 profils d’utilisateurs ont été définis quant à l’accès aux onglets
						et aux opérations du menu principal :
					</p>
					<ul>
						<li>Administrateur de l’application</li>
						<li>Propriétaire de collection de concepts</li>
						<li>Propriétaire de concepts</li>
						<li>Guest</li>
					</ul>
					<p>Onglets accessibles suivant les profils utilisateur (rôle) :</p>
					<ul>
						<li>
							Administrateur de l’application : Naviguer dans les référentiels,
							Concepts, Collections, Aide, Administration
						</li>
						<li>
							Propriétaire de collection de concepts : Naviguer dans les
							référentiels, Concepts, Collections, Aide
						</li>
						<li>
							Propriétaire de concepts : Naviguer dans les référentiels,
							Concepts, Collections, Aide
						</li>
						<li>
							Guest : Naviguer dans les référentiels, Concepts, Collections,
							Aide
						</li>
					</ul>
					<p>
						Opérations sur les concepts accessibles par le menu principal
						suivant les profils utilisateur (rôle) :
					</p>
					<ul>
						<li>
							Administrateur de l’application : Nouveau ; Exporter ; Valider
						</li>
						<li>Propriétaire de collection de concepts : Exporter ; Valider</li>
						<li>Propriétaire de concepts : Exporter ; Valider</li>
						<li>Guest : Exporter</li>
					</ul>
				</React.Fragment>
			),
			en: <p>Work in progress</p>,
		},
	},
	{
		id: 2,
		title: {
			fr: 'Rechercher un concept',
			en: 'Search concept',
		},
		body: {
			fr: (
				<React.Fragment>
					<p>
						La recherche d’un concept peut se faire à partir de la page
						d’accueil (onglet{' '}
						<Link to={`/concepts`} className="content-link">
							Concept
						</Link>{' '}
						dans la barre horizontale de menu) ou à partir de la page de
						recherche avancée, qui permet de rechercher sur des critères.
					</p>
					<p>
						<b>Concepts/ Accueil / recherche</b>
					</p>
					<p>Cette page présente :</p>
					<ul>
						<li>
							un menu principal encadré à gauche de la page pour des opérations
							sur les concepts ;
						</li>
						<li>
							un moteur de recherche sur la totalité des concepts de
							l’application situé :{' '}
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
						<b>Concepts / recherche avancée</b>
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
						La création d’un concept se faire à partir de la page d’accueil
						(onglet{' '}
						<Link to={`/concepts`} className="content-link">
							Concept
						</Link>{' '}
						dans la barre horizontale de menu)
					</p>
					<p>
						Pour accéder à l’écran de création, cliquer sur l’option{' '}
						<Link to={`/concepts`} className="content-link">
							Nouveau
						</Link>{' '}
						du menu à gauche.
					</p>
					<p>La première page de création du concept s’affiche.</p>
					<p>
						Le bouton{' '}
						<Link to={`/concept/create`} className="content-link">
							Annuler
						</Link>{' '}
						permet de revenir à la page d’accueil de l’onglet Concept.
					</p>
					<p>
						Le bouton{' '}
						<Link to={`/concept/create`} className="content-link">
							Sauvegarder
						</Link>{' '}
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
													renseigné à la création
												</b>{' '}
												(une fois la date renseignée, dès lors que la date
												renseignée est atteinte, le concept ne peut plus être
												modifié).
											</li>
										</ul>
										<p>
											Le bouton{' '}
											<Link to={`/concept/create`} className="content-link">
												Sauvegarder
											</Link>{' '}
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
];
