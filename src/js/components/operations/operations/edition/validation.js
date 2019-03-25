import D from 'js/i18n';

export function validate(operation) {
	let errorMessage =
		!operation.prefLabelLg1 || !operation.prefLabelLg2
			? D.requiredPrefLabel
			: '';

	if (!operation.series) {
		errorMessage = D.requiredSeries;
	}
	return {
		fields: {
			prefLabelLg1: !operation.prefLabelLg1,
			prefLabelLg2: !operation.prefLabelLg2,
			series: !operation.series,
		},
		errorMessage,
	};
}
