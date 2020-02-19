import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, ActionToolbar } from '@inseefr/wilco';
import D from 'js/i18n';

function Controls(props) {
	const location = props.history.location.pathname;
	const nexLocation = location.replace('/compare', '');
	return (
		<ActionToolbar>
			<Button label={D.btnReturnCurrent} action={nexLocation} col={3} />
		</ActionToolbar>
	);
}

export default withRouter(Controls);
