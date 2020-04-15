import React from 'react';
import { AbstractButton } from '@inseefr/wilco';
import D from '../../i18n/build-dictionary';

export default props => {
	return (
		<AbstractButton icon="flash" {...props}>
			{D.btnReinitialize}
		</AbstractButton>
	);
};
