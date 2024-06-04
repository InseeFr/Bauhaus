import React from 'react';
import { useHistory } from 'react-router-dom';
import { ReturnButton, ActionToolbar } from '@inseefr/wilco';
import { useGoBack } from '../../../../hooks/hooks';

function ClassificationControls() {
	const history = useHistory();
	const goBack = useGoBack();
	const location = history.location.pathname;
	const nextLocation = location.replace('/tree', '');

	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack(nextLocation)} />
		</ActionToolbar>
	);
}

export default ClassificationControls;
