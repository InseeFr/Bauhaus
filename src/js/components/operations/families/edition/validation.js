import D from 'js/i18n';

export function validate(family) {
	return {
		fields: {
			prefLabelLg1: !family.prefLabelLg1,
			prefLabelLg2: !family.prefLabelLg2,
		},
		errorMessage:
			!family.prefLabelLg1 || !family.prefLabelLg2 ? D.requiredPrefLabel : '',
	};
}
