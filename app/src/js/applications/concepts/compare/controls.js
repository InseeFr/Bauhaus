import React from 'react';
import { useLocation } from 'react-router-dom';
import { ReturnButton, ActionToolbar } from '@inseefr/wilco';
import { useRedirectWithDefault } from 'bauhaus-utilities';

const Controls = () => {
	const location = useLocation();
	const goBack = useRedirectWithDefault(
		location.pathname.replace('/compare', '')
	);
	return (
		<ActionToolbar>
			<ReturnButton action={goBack} col={3} />
		</ActionToolbar>
	);
};

export default Controls;
