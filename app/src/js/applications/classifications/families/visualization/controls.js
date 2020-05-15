import React from 'react';
import { withRouter } from 'react-router-dom';
import { goBack, ReturnButton, ActionToolbar } from '@inseefr/wilco';

function FamilyControls(props) {
	return (
		<ActionToolbar>
			<ReturnButton action={goBack(props, `/classifications/families`)} />
		</ActionToolbar>
	);
}

export default withRouter(FamilyControls);
