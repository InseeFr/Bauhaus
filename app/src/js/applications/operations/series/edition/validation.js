import D from 'js/i18n';

export function validate(serie) {
	let errorMessage = '';

	if(!serie.creators || serie.creators.length === 0){
		errorMessage = D.requiredOwner;
	}

	if(!serie.prefLabelLg1 || !serie.prefLabelLg2 ){
		errorMessage = D.requiredPrefLabel;
	}

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
