import D from 'js/i18n';

export function validate(indicator) {
	return {
		fields: {
			prefLabelLg1: !indicator.prefLabelLg1,
			prefLabelLg2: !indicator.prefLabelLg2,
		},
		errorMessage:
			!indicator.prefLabelLg1 || !indicator.prefLabelLg2
				? D.requiredPrefLabel
				: '',
	};
}
