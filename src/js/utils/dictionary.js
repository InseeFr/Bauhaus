import { lang1 } from 'config';

const dictionaryMulti = {
	fr: {
		displayLg2: 'Afficher la version anglaise',
		requiredFields: 'Champs requis',
		noResult: 'Aucun résultat',
		maxLengthScopeNote: 'caractères maximum',
		calendar: {
			days: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
			months: [
				'Janvier',
				'Février',
				'Mars',
				'Avril',
				'Mai',
				'Juin',
				'Juillet',
				'Août',
				'Septembre',
				'Octobre',
				'Novembre',
				'Décembre',
			],
		},
		status: {
			concept: {
				valid: 'Validé',
				provisional: 'Provisoire',
				validationStatus: {
					defaultValue: 'Sélectionnez le statut de validation ...',
				},
			},
			collection: {
				valid: 'Validée',
				provisional: 'Provisoire',
				validationStatus: {
					defaultValue: 'Sélectionnez le statut de validation ...',
				},
			},
		},
		buttons: {
			new: {
				concept: 'Nouveau',
				collection: 'Nouvelle',
			},
			close: 'Fermer',
			export: 'Exporter',
			validate: 'Valider',
			cancel: 'Annuler',
			save: 'Sauvegarder',
			modify: 'Modifier',
			compare: 'Comparer',
			send: 'Envoyer',
			return: 'Retour',
			initialize: 'Réinitialiser',
			returnCurrent: 'Retour à la version courante',
			minorVersion: 'Ecraser la version',
			majorVersion: 'Nouvelle version',
			pdfButton: 'Exporter en PDF',
			odtButton: 'Exporter en ODT',
			add: 'Ajouter',
		},
		navbar: {
			referenciels: {
				home: 'Accueil',
				concepts: 'Concepts',
				classifications: 'Nomenclatures',
				sources: 'Operations',
			},
			concepts: {
				home: 'Naviguer dans les référentiels',
				concepts: 'Concepts',
				collections: 'Collections',
				help: 'Aide',
				administration: 'Administration',
			},
			operations: {
				home: 'Naviguer dans les référentiels',
				famillies: 'Familles',
				series: 'Séries',
				operations: 'Opérations',
			},
		},
		warning: {
			missing: {
				concept:
					'Remplissez les champs requis pour pouvoir sauvegarder ce concept',
				collection:
					'Remplissez les champs requis pour pouvoir sauvegarder cette collection',
			},
			duplicated: {
				id: "L'identifiant choisi existe déjà",
				label: 'Le libellé choisi existe déjà',
			},
			validation: {
				concepts: 'Ajouter au moins un concept à valider',
				collections: 'Ajouter au moins une collection à valider',
			},
			notes: {
				definitionLg1:
					'Le concept doit nécessairement comporter une définition française',
				scopeNoteLg1:
					'Le statut de diffusion étant public, la définition courte française doit être renseignée',
				maxLengthScopeNote: function(maxLengthScopeNote) {
					return `La définition courte est limitée à ${maxLengthScopeNote} caractères`;
				},
				definition:
					"La définition anglaise ne peut être renseignée qu'à condition de renseigner la version française",
				scopeNote:
					"La définition courte anglaise ne peut être renseignée qu'à condition de renseigner la version française",
				editorialeNote:
					"La note éditoriale anglaise ne peut être renseignée qu'à condition de renseigner la version française",
				changeNote:
					"La note de changement anglaise ne peut être renseignée qu'à condition de renseigner la version française",
			},
			export: {
				concepts: 'Ajouter au moins un concept à exporter',
				collections: 'Ajouter au moins une collection à exporter',
			},
			send: {
				mail: 'Saisir une adresse mail valide pour le destinataire',
				subject: "L'objet du message est vide",
				body: 'Le corps du message est vide',
			},
		},
		pagination: {
			first: 'Début',
			last: 'Fin',
		},
		loadable: {
			loading: 'Chargement en cours ...',
			saving: 'Sauvegarde en cours ...',
			validation: 'Validation en cours ...',
			sending: 'Envoi en cours ...',
			exporting: 'Export en cours ...',
			authentification: 'Authentification en cours ...',
		},
		links: {
			title: 'Liens',
			narrower: 'Concept parent',
			broader: 'Concept enfant',
			references: 'Concept référencé',
			replaces: 'Succède à',
			related: 'Concept lié',
		},
		notes: {
			title: 'Notes',
			definition: 'Définition',
			scopeNote: 'Définition courte',
			editorialeNote: 'Note éditoriale',
			changeNote: 'Note de changement',
		},
		app: {
			title: 'Application de gestion des métadonnées de référence',
			conceptsTitle: 'Concepts',
			classificationsTitle: 'Nomenclatures',
			sourcesTitle: 'Operations',
		},
		concepts: {
			title: 'Concepts - Recherche',
			advancedSearch: 'Recherche avancée',
			label: 'Libellé',
			searchLabel: 'Libellé ...',
			searchLabelHome: 'Libellé du concept (ou synonyme) ...',
			search: {
				title: 'Concepts - Recherche avancée',
				label: 'Libellé du concept ...',
				altLabel: 'Synonyme du concept ...',
				definition: 'Rechercher dans la définition du concept ...',
			},
			result: ' résultat',
			results: ' résultats',
			export: {
				title: 'Export',
				panel: 'Concepts à exporter',
			},
			validation: {
				title: 'Validation des concepts provisoires',
				panel: 'Concepts à valider',
			},
		},
		concept: {
			general: 'Informations générales',
			label: 'Libellé',
			searchLabel: 'Libellé ...',
			altLabel: 'Libellé alternatif',
			created: 'Date de création',
			modified: 'Date de modification',
			valid: 'Date de fin de validité',
			conceptVersion: 'Version du concept',
			creator: 'Propriétaire',
			contributor: 'Gestionnaire',
			stamps: {
				defaultValue: 'Sélectionnez un timbre ...',
			},
			disseminationStatus: {
				title: 'Statut de diffusion',
				defaultValue: 'Sélectionnez un statut de diffusion ...',
			},
			additionalMaterial: 'Document lié',
			isValidated: 'Etat du concept',
			version: 'Version',
			create: 'Créer un nouveau concept',
			modify: 'Modifier le concept',
			send: {
				recipient: 'Destinataire',
				sender: 'Emetteur',
				subject: {
					title: 'Objet',
					value: function(params) {
						return `RMéS - Envoi du descriptif du concept « ${params} »`;
					},
				},
				message: {
					title: 'Message',
					value: function(params) {
						var prefLabelLg1 = params[1],
							id = params[2],
							validText = '',
							href = params[0] + 'concept/' + id,
							inseeText = ` (<a href=${href}>Lien vers le concept</a>)`;
						if (params.includes('Provisoire'))
							validText = `<p><b>Ce concept est en attente de validation.</b></p>`;

						return `<p>Bonjour,</p>
              <p>Vous trouverez ci-joint la description du concept « <b>
              ${prefLabelLg1}
              </b> »${inseeText} extraite de la base RMéS-Concepts.</p>
              ${validText}
              <p>Pour toute demande concernant ce concept merci de répondre via la boîte fonctionnelle :DG75 RMéS-Concepts et définitions.</p>
              <p>L'équipe RMéS<br/>
              Insee-DG<br/>
              DMCSI-Unité Qualité</p>`;
					},
				},
				title: function(params) {
					return `Envoyer le concept " ${params} "`;
				},
				success: function(params) {
					return `Le concept " ${params} " a bien été envoyé`;
				},
				failed: function(params) {
					return `Le concept " ${params} " n'a pas été envoyé`;
				},
			},
			versioning: {
				title: 'Veuillez sélectionner le type de version',
				body: function(params) {
					return `<p>Les notes du concept « <b>${params}</b> » ont été modifiées.</p>
                  <p>Voulez-vous créer une nouvelle version, ou écraser les données précédentes ?</p>`;
				},
				footer: `<p>Pour créer une nouvelle version, la note de changement doit être documentée :</p>
                  <ul><li><p>La note ne peut être vide</p></li>
                  <li><p>La note doit être différente de celle de la version précédente</p></li></ul>`,
			},
			exporting: {
				title: "Veuillez sélectionner le type d'export",
				body: `<p>Les PDF ne sont pas modifiables.</p>
					<p>Les ODT sont modifiables sous Libre Office.</p>`,
			},
		},
		collections: {
			title: 'Collections - Recherche',
			label: 'Libellé',
			searchLabel: 'Libellé ...',
			result: ' résultat',
			results: ' résultats',
			export: {
				title: 'Export',
				panel: 'Collections à exporter',
			},
			validation: {
				title: 'Validation des collections provisoires',
				panel: 'Collections à valider',
			},
		},
		collection: {
			general: 'Informations générales',
			id: 'Identifiant de la collection',
			label: 'Libellé',
			searchLabel: 'Libellé ...',
			created: 'Date de création',
			modified: 'Date de modification',
			valid: 'Date de fin de validité',
			creator: 'Propriétaire',
			contributor: 'Gestionnaire',
			stamps: {
				defaultValue: 'Sélectionnez un timbre ...',
			},
			disseminationStatus: {
				title: 'Statut de diffusion',
				defaultValue: 'Sélectionnez un statut de diffusion ...',
			},
			isValidated: 'Etat de la collection',
			description: 'Description',
			members: 'Concepts membres de la collection',
			create: 'Créer une nouvelle collection',
			modify: 'Modifier la collection',
			send: {
				recipient: 'Destinataire',
				sender: 'Emetteur',
				subject: {
					title: 'Objet',
					value: function(params) {
						return `RMéS - Envoi de la composition de la collection « ${params} »`;
					},
				},
				message: {
					title: 'Message',
					value: function(params) {
						var prefLabelLg1 = params[1],
							validText = '',
							id = params[2],
							href = params[0] + 'collection/' + id,
							inseeText = ` (<a href=${href}>Lien vers la collection</a>)`;

						if (params.includes('Provisoire'))
							validText = `<p><b>Cette collection est en attente de validation.</b></p>`;

						return `<p>Bonjour,</p>
              <p>Vous trouverez ci-joint la composition de la collection de concepts « <b>
              ${prefLabelLg1}
              </b> »${inseeText} extraite de la base RMéS-Concepts.</p>
              ${validText}
              <p>Pour toute demande concernant cette collection merci de répondre via la boîte fonctionnelle :DG75 RMéS-Concepts et définitions.</p>
              <p>L'équipe RMéS<br/>
              Insee-DG<br/>
              DMCSI-Unité Qualité</p>`;
					},
				},
				title: function(params) {
					return `Envoyer la collection " ${params} "`;
				},
				success: function(params) {
					return `La collection " ${params} " a bien été envoyée`;
				},
				failed: function(params) {
					return `La collection " ${params} " n'a pas été envoyée`;
				},
			},
		},
		operations: {
			famillies: {
				title: 'Familles',
			},
			series: {
				title: 'Séries',
			},
			operations: {
				title: 'Opérations',
			},
		},
	},
	en: {
		displayLg2: 'Display french version',
		requiredFields: 'Required fields',
		status: {
			concept: {
				valid: 'Validé',
				provisional: 'Provisoire',
			},
			collection: {
				valid: 'Validée',
				provisional: 'Provisoire',
			},
		},
		buttons: {
			new: {
				concept: 'New',
				collection: 'New',
			},
			close: 'Close',
			export: 'Export',
			validate: 'Validate',
			cancel: 'Cancel',
			save: 'Save',
			modify: 'Modify',
			compare: 'Compare',
			send: 'Send',
			return: 'Return',
			initialize: 'Reinitialize',
			returnCurrent: 'Return to current version',
			minorVersion: 'Overwrite version',
			majorVersion: 'New version',
		},
		navbar: {
			concepts: {
				home: 'Home',
				concepts: 'Concepts',
				collections: 'Collections',
				help: 'Help',
				administration: 'Administration',
			},
		},
		warning: {
			missing: {
				concept: 'Complete required fields to save this concept',
				collection: 'Complete required fields to save this collection',
			},
			duplicated: {
				id: 'Identifiant has already been selected',
				label: 'Label has already been selected',
			},
			validation: {
				concepts: 'Add a concept at least',
				collections: 'Add a collection at least',
			},
			notes: {
				definitionLg1: 'Concept necessary has a definition',
				scopeNoteLg1:
					'As dissemination status is public, short definition has to be completed',
				maxLengthScopeNote: function(maxLengthScopeNote) {
					return `La définition courte est limitée à ${maxLengthScopeNote} caractères`;
				},
				definition:
					"French definition can't be completed if the english is not",
				scopeNote:
					"French short definition can't be completed if the english is not",
				editorialeNote:
					"French editorial note can't be completed if the english is not",
				changeNote:
					"French change note can't be completed if the english is not",
			},
			export: {
				concepts: 'Add a concept at least to export',
				collections: 'Add a collection at least to export',
			},
			send: {
				mail: 'Mail of recipient is not valid',
				subject: 'Object of message is empty',
				body: 'Body of message is empty',
			},
		},
		pagination: {
			first: 'First',
			last: 'Last',
		},
		loadable: {
			loading: 'Loading in progress ...',
			saving: 'Saving in progress ...',
			validation: 'Validation in progress ...',
			sending: 'Sending in progress ...',
			exporting: 'Export in progress ...',
		},
		links: {
			title: 'Liens',
			narrower: 'Narrower',
			broader: 'Broader',
			references: 'References',
			replaces: 'Replaces',
			related: 'Related',
		},
		notes: {
			title: 'Notes',
			definition: 'Definition',
			scopeNote: 'Short definition',
			editorialeNote: 'Editorial note',
			changeNote: 'Change note',
		},
		app: {
			title: 'Metadata management application',
			conceptsTitle: 'Concepts',
			classificationsTitle: 'Nomenclatures',
			sourcesTitle: 'Operations',
		},
		concepts: {
			title: 'Concepts - Research',
			label: 'Label',
			searchLabel: 'Label ...',
			result: ' result',
			results: ' results',
			export: {
				title: 'Export',
				panel: 'Concepts to export',
			},
			validation: {
				title: 'Validation of provisional concepts',
				panel: 'Concepts to valid',
			},
		},
		concept: {
			general: 'General informations',
			label: 'Label',
			searchLabel: 'Label ...',
			altLabel: 'Alternative label',
			created: 'Creation date',
			modified: 'Modification date',
			valid: 'Ended date',
			conceptVersion: 'Concept version',
			creator: 'Creator',
			contributor: 'Contributor',
			stamps: {
				defaultValue: 'Select a stamp ...',
			},
			disseminationStatus: {
				title: 'Dissemination status',
				defaultValue: 'Select a dissemination status ...',
			},
			additionalMaterial: 'Additional material',
			isValidated: 'State of concept',
			version: 'Version',
			create: 'Create new concept',
			modify: 'Modify concept',
			send: {
				recipient: 'Recipient',
				sender: 'Sender',
				subject: {
					title: 'Object',
					value: function(params) {
						return `RMéS - Envoi du descriptif du concept « ${params} »`;
					},
				},
				message: {
					title: 'Message',
					value: function(params) {
						return `<p>Bonjour,</p>
              <p>Vous trouverez ci-joint la description du concept « <b>
              ${params}
              </b> » extraite de la base RMéS-Concepts.</p>
              <p>Pour toute demande concernant ce concept merci de répondre via la boîte fonctionnelle :DG75 RMéS-Concepts et définitions.</p>
              <p>L'équipe RMéS<br/>
              Insee-DG<br/>
              DMCSI-Unité Qualité</p>`;
					},
					provisionalValue: function(params) {
						return `<p>Bonjour,</p>
              <p>Vous trouverez ci-joint la description du concept « <b>
              ${params}
              </b> » extraite de la base RMéS-Concepts.</p>
              <p><b>Ce concept est en attente de validation.</b></p>
              <p>Pour toute demande concernant ce concept merci de répondre via la boîte fonctionnelle :DG75 RMéS-Concepts et définitions.</p>
              <p>L'équipe RMéS<br/>
              Insee-DG<br/>
              DMCSI-Unité Qualité</p>`;
					},
				},
				title: function(params) {
					return `Send concept " ${params} "`;
				},
				success: function(params) {
					return `Concept " ${params} " has been sent`;
				},
			},
			versioning: {
				title: 'Veuillez sélectionner le type de version',
				body: function(params) {
					return `<p>Les notes du concept « <b>${params}</b> » ont été modifiées.</p>
        <p>Voulez-vous créer une nouvelle version, ou écraser les données précédentes?</p>`;
				},
			},
		},
		collections: {
			title: 'Collections - Research',
			label: 'Label',
			searchLabel: 'Label ...',
			result: ' result',
			results: ' results',
			export: {
				title: 'Export',
				panel: 'Collections to export',
			},
			validation: {
				title: 'Validation of provisional collections',
				toValid: 'Collections to valid',
			},
		},
		collection: {
			general: 'General informations',
			id: 'Identifiant collection',
			label: 'Label',
			searchLabel: 'Label ...',
			created: 'Creation date',
			modified: 'Modification date',
			valid: 'Ended date',
			creator: 'Creator',
			contributor: 'Contributor',
			isValidated: 'State of collection',
			description: 'Description',
			members: 'Concepts of collection',
			create: 'Create new collection',
			modify: 'Modify collection',
			send: {
				recipient: 'Recipient',
				sender: 'Sender',
				subject: {
					title: 'Object',
					value: function(params) {
						return `RMéS - Envoi de la composition de la collection « ${params} »`;
					},
				},
				message: {
					title: 'Message',
					value: function(params) {
						return `<p>Bonjour,</p>
              <p>Vous trouverez ci-joint la composition de la collection de concepts « <b>
              ${params}
              </b> » extraite de la base RMéS-Concepts.</p>
              <p>Pour toute demande concernant cette collection merci de répondre via la boîte fonctionnelle :DG75 RMéS-Concepts et définitions.</p>
              <p>L'équipe RMéS<br/>
              Insee-DG<br/>
              DMCSI-Unité Qualité</p>`;
					},
					provisionalValue: function(params) {
						return `<p>Bonjour,</p>
              <p>Vous trouverez ci-joint la composition de la collection de concepts « <b>
              ${params}
              </b> » extraite de la base RMéS-Concepts.</p>
              <p><b>Cette collection est en attente de validation.</b></p>
              <p>Pour toute demande concernant cette collection merci de répondre via la boîte fonctionnelle :DG75 RMéS-Concepts et définitions.</p>
              <p>L'équipe RMéS<br/>
              Insee-DG<br/>
              DMCSI-Unité Qualité</p>`;
					},
				},
				title: function(params) {
					return `Send collection " ${params} "`;
				},
				success: function(params) {
					return `Collection " ${params} " has been sent`;
				},
			},
		},
	},
};

export const dictionary = dictionaryMulti[lang1];
