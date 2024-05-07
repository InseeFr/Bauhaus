import React from 'react';
import { withRouter } from 'react-router-dom';
import { goBack, ReturnButton, ActionToolbar } from '@inseefr/wilco';

function ClassificationControls(props) {
	const location = props.history.location.pathname;
	const nextLocation = location.replace('/tree', '');

	return (
		<ActionToolbar>
			<ReturnButton action={goBack(props, nextLocation)} />
		</ActionToolbar>
	);
}

export default withRouter(ClassificationControls);
