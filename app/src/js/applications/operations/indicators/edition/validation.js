import D from 'js/i18n';

export function validate(indicator) {
	let errorMessage = '';
	/*if(!indicator.creators || indicator.creators.length === 0){
		errorMessage = D.requiredOwner;
	}*/
	if(!indicator.prefLabelLg1 || !indicator.prefLabelLg2){
		errorMessage = D.requiredPrefLabel;
	}
	return {
		fields: {
			prefLabelLg1: !indicator.prefLabelLg1,
			prefLabelLg2: !indicator.prefLabelLg2,
		},
		errorMessage
	};
}
