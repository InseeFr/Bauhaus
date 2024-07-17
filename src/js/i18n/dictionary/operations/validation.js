const messages = {
	requiredPrefLabel: {
		fr: "L'intitulé est obligatoire",
		en: 'The title is required',
	},
	requiredLang: {
		fr: 'La langue est obligatoire',
		en: 'The language is required',
	},
	badUrl: {
		fr: "L'URL n'est pas valide",
		en: 'The link is not valid',
	},
	requiredFile: {
		fr: 'Le fichier est obligatoire',
		en: 'The file is required',
	},
	requiredUpdatedDate: {
		fr: 'La date de mise à jour est obligatoire',
		en: 'The update date is required',
	},
	wrongFileName: {
		fr: 'Le nom du fichier est incorrect. Il peut contenir des caractères alphanumériques (hors caractères accentués), des tirets et des tirets bas.',
		en: 'The file name is incorrect. It can comprise alphanumeric (except accented characters), dash and underscore symbols',
	},
	documents: {
		serverSideErrors: {
			304: {
				en: 'You cannot edit the file if the document has a quality report attached. To modify the file, please first remove it from the quality report. For more information, please contact the administration team',
				fr: "Vous ne pouvez pas modifier le fichier si le document est attaché à un rapport qualité. Pour modifier le fichier, veuillez tout d'abord le retirer du rapport qualité. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
			},
		},
	},
};

export default messages;
