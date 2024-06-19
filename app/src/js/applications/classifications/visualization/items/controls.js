import React from 'react';
import { useLocation } from 'react-router-dom';
import { ReturnButton, ActionToolbar } from '@inseefr/wilco';
import { useGoBack } from '../../../../hooks/hooks';

function ClassificationControls() {
	const goBack = useGoBack();
	const location = useLocation();
	const nextLocation = location.pathname.replace('/items', '');

	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack(nextLocation)} />
		</ActionToolbar>
	);
}

export default ClassificationControls;
