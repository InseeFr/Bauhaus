import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'bauhaus-library';
import D from 'js/i18n';

function Controls(props) {
	const location = props.history.location.pathname;
	const nexLocation = location.replace('/compare', '');
	return (
		<div className="row btn-line action-toolbar">
			<Button label={D.btnReturnCurrent} action={nexLocation} col={3} />
		</div>
	);
}

export default withRouter(Controls);
