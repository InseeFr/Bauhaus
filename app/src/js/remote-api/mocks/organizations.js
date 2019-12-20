export const getOrganisations = () => {
	return Promise.resolve([
		{
			id: 'Acoss',
			label: 'Agence centrale des organismes de sécurité sociale',
		},
		{ id: 'Bpifrance', label: "Banque Publique d'Investissement" },
		{
			altLabel: 'Service Statistique Finances publiques',
			id: 'GF3C',
			label: 'Bureau des Études statistiques en matière fiscale',
		},
		{
			id: 'CNAMTS',
			label:
				'Caisse Nationale de l\u2019Assurance Maladie des Travailleurs Salaries',
		},
		{
			id: 'DG75-F110',
			label: "Cellule statistiques et études sur l'immigration",
		},
		{
			id: 'CépiDc',
			label: "Centre d'épidémiologie sur les causes médicales de Décès",
		},
		{ id: 'CASD', label: 'Centre d\u2019Accès Sécurisé aux Données' },
		{
			id: 'Céreq',
			label: 'Centre d\u2019Etudes et de Recherches sur les Qualifications',
		},
		{ id: 'DGAC', label: "Direction Générale de l'Aviation Civile" },
		{ id: 'DGE', label: 'Direction Générale des Entreprises' },
		{
			altLabel:
				'Service Statistique Travail, emploi et formation professionnelle',
			id: 'Dares',
			label:
				"Direction de l'Animation de la Recherche, des Études et des Statistiques",
		},
		{
			altLabel: 'Service Statistique Éducation',
			id: 'Depp',
			label:
				"Direction de l'Évaluation, de la Prospective et de la Performance",
		},
		{
			id: 'DG75-H001',
			label: "Direction de la Diffusion et de l'Action Régionale",
		},
		{
			id: 'DG75-L001',
			label:
				'Direction de la Méthodologie et de la Coordination Statistique et Internationale',
		},
		{
			altLabel: 'Service statistique Santé et solidarités',
			id: 'Drees',
			label:
				"Direction de la Recherche, des Études, de l'Évaluation et des Statistiques",
		},
		{
			id: 'DG75-G001',
			label: 'Direction des Etudes et des Synthèses Economiques',
		},
		{ id: 'DST', label: 'Direction des Services de Transports' },
		{ id: 'DG75-E001', label: "Direction des Statistiques d'Entreprises" },
		{
			id: 'DG75-F001',
			label: 'Direction des statistiques démographiques et sociales',
		},
		{
			id: 'BDF',
			label: 'Direction générale des statistiques de la Banque de France',
		},
		{
			id: 'DG75-E220',
			label: 'Division  infrastructures et répertoire statistiques',
		},
		{ id: 'DG75-E410', label: 'Division Commerce' },
		{
			id: 'DG75-E330',
			label: 'Division Elaboration des statistiques de production industrielle',
		},
		{ id: 'DG75-G120', label: 'Division Enquête de conjoncture' },
		{ id: 'DG75-E440', label: 'Division Industrie et agriculture' },
		{
			id: 'DG75-F620',
			label: "Division Maitrise d'oeuvre des activités d'enquête",
		},
		{
			id: 'DG75-F520',
			label: 'Division Méthodes et traitement des recensements',
		},
		{
			id: 'DG75-F510',
			label: 'Division Organisation des recensements et relations extérieures',
		},
		{ id: 'DG75-E420', label: 'Division Services' },
		{ id: 'DG75-H310', label: 'Division Statistiques et analyses urbaines' },
		{ id: 'DG75-G140', label: 'Division Synthèse conjoncturelle' },
		{ id: 'DG75-G430', label: 'Division comptes trimestriels' },
		{
			id: 'DG75-G450',
			label: 'Division concepts, méthodes et évaluation des comptes nationaux',
		},
		{ id: 'DG75-F340', label: 'Division conditions de vie des ménages' },
		{ id: 'DG75-F230', label: 'Division emploi' },
		{ id: 'DG75-F170', label: 'Division enquêtes et études démographiques' },
		{
			id: 'DG75-E430',
			label: 'Division enquêtes thématiques et études transversales',
		},
		{ id: 'DG75-E320', label: "Division indicateurs conjoncturels d'activité" },
		{ id: 'DG75-E310', label: 'Division indices des prix à la production' },
		{ id: 'DG75-F330', label: 'Division logement' },
		{ id: 'DG75-F610', label: 'Division prix à la consommation' },
		{ id: 'DG75-F350', label: 'Division revenus et patrimoine des ménages' },
		{ id: 'DG75-F240', label: "Division salaires et revenus d'activité" },
		{ id: 'DG75-H320', label: 'Division statistiques régionales et locales' },
		{ id: 'DG75-G420', label: 'Division synthèse des biens et services' },
		{
			id: 'DG75-F210',
			label: 'Division synthèse et conjoncture du marché du travail',
		},
		{ id: 'DG75-G410', label: 'Division synthèse générale des comptes' },
		{
			id: 'DG75-E210',
			label: "Division élaboration des statistiques annuelles d'entreprise",
		},
		{ id: 'DG75-H301', label: "Département de l'action régionale" },
		{
			id: 'DG75-F201',
			label: "Département de l'emploi et des revenus d'activité",
		},
		{ id: 'DG75-G101', label: 'Département de la conjoncture' },
		{ id: 'DG75-F501', label: 'Département de la démographie' },
		{
			altLabel: 'Service Statistique Douanes',
			id: 'DSEE',
			label: 'Département des Statistiques et des Études économiques',
		},
		{
			altLabel: 'Service Statistique Immigration',
			id: 'DSED',
			label: 'Département des Statistiques, des Études et de la Documentation',
		},
		{ id: 'DG75-G401', label: 'Département des comptes nationaux' },
		{
			id: 'DG75-F301',
			label: 'Département des ressources et des conditions de vie des ménages',
		},
		{
			altLabel: 'Service Statistique Collectivités locales ',
			id: 'DESL',
			label: 'Département des Études et des Statistiques locales',
		},
		{
			altLabel: 'Service statistique Culture',
			id: 'Deps',
			label: 'Département des Études, de la Prospective et des Statistiques',
		},
		{
			altLabel: 'Service Statistique Fonction publique',
			id: 'Dessi',
			label:
				'Département des Études, des Statistiques et des Systèmes d\u2019Information',
		},
		{
			id: 'DG75-E201',
			label:
				'Département répertoires, infrastructures et statistiques structurelles',
		},
		{ id: 'DG75-E301', label: 'Département statistiques de court terme' },
		{ id: 'DG75-E401', label: 'Département synthèses sectorielles' },
		{
			id: 'Insee',
			label: 'Institut national de la statistique et des études économiques',
		},
		{
			altLabel: 'Service Statistique Jeunesse et Sports',
			id: 'Meos',
			label: "Mission des Études, de l'Observation et des Statistiques",
		},
		{
			id: 'ONDRP',
			label: 'Observatoire national de la délinquance et des réponses pénales',
		},
		{
			id: 'ONISR',
			label: 'Observatoire national interministériel de la sécurité routière',
		},
		{
			altLabel: 'Service Statistique Défense',
			id: 'OED',
			label: 'Observatoire économique de la Défense',
		},
		{
			altLabel: 'Service statistique Agriculture',
			id: 'SSP',
			label: 'Service de la Statistique et de la Prospective',
		},
		{
			altLabel: 'Service Statistique Développement durable',
			id: 'SDES',
			label: 'Service de la donnée et des études statistiques',
		},
		{
			id: 'SRSEDPD',
			label:
				"Service des risques sanitaires liés à l'environnement, des déchets et des pollutions diffuses",
		},
		{
			altLabel: 'Service Statistique Sécurité intérieure',
			id: 'SSMSI',
			label: 'Service statistique ministériel de la Sécurité intérieure',
		},
		{
			altLabel: 'Service Statistique Justice',
			id: 'SDSE',
			label: 'Sous-direction de la Statistique et des Études',
		},
		{
			altLabel: 'Service Statistique Enseignement supérieur, recherche',
			id: 'Sies',
			label:
				"Sous-direction des Systèmes d'information et des Études statistiques",
		},
		{
			id: 'DG75-F601',
			label: 'Unité des prix à la consommation et des enquêtes ménage',
		},
		{ id: 'DG75-F101', label: 'Unité des études démographiques et sociales' },
		{ id: 'VNF', label: 'Voies Navigables de France' },
	]);
};
