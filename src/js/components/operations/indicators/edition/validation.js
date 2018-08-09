import D from 'js/i18n';

export function validate(indicator) {
	if (!indicator.prefLabelLg1 || !indicator.prefLabelLg2) {
		return D.requiredPrefLabel;
	}
}
