import React from 'react';
import { Button, ActionToolbar } from '@inseefr/wilco';
import D from 'js/i18n';
import { useRedirectWithDefault } from 'bauhaus-utilities';
import { useLocation } from 'react-router-dom';

function Controls() {
	const location = useLocation();
	const goBack = useRedirectWithDefault(location.pathname.replace('/compare', ''))
	return (
		<ActionToolbar>
			<Button label={D.btnReturnCurrent} action={goBack} col={3} />
		</ActionToolbar>
	);
}

export default Controls;
