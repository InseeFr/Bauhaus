import D from 'js/i18n';

export function validate(serie) {
	let errorMessage =
		!serie.prefLabelLg1 || !serie.prefLabelLg2 ? D.requiredPrefLabel : '';

	if (!serie.family) {
		errorMessage = D.requiredFamily;
	}

	return {
		fields: {
			prefLabelLg1: !serie.prefLabelLg1,
			prefLabelLg2: !serie.prefLabelLg2,
			family: !serie.family,
		},
		errorMessage,
	};
}
