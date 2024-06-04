import React from 'react';
import { useHistory } from 'react-router-dom';
import { ReturnButton, ActionToolbar } from '@inseefr/wilco';
import { useGoBack } from '../../../../hooks/hooks';

function ClassificationControls() {
	const goBack = useGoBack();
	const history = useHistory();
	const location = history.location.pathname;
	const nextLocation = location.replace('/items', '');

	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack(nextLocation)} />
		</ActionToolbar>
	);
}

export default ClassificationControls;
