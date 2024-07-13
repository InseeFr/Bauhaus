const messages = {
	errors: {
		GlobalClientSideErrorBloc: {
			fr: 'Vous avez des erreurs dans ce formulaire.',
			en: 'You have errors in this form.',
		},
	},
	//TODO find a solution in order to avoid this duplicated key
	mandatoryProperty: {
		fr: (propertyName) =>
			`La propriété <strong>${propertyName}</strong> est obligatoire.`,
		en: (propertyName) =>
			`The property <strong>${propertyName}</strong> is required.`,
	},
};

export default messages;
