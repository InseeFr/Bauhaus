import React from 'react';
import { ReturnButton, ActionToolbar } from '@inseefr/wilco';
import { useGoBack } from '../../../../hooks/hooks';
import { useHistory } from 'react-router-dom';

function ClassificationControls() {
	const goBack = useGoBack();
	const history = useHistory();

	const location = history.location.pathname;
	const nextLocation = location.replace('/tree', '');

	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack(nextLocation)} />
		</ActionToolbar>
	);
}

export default ClassificationControls;
