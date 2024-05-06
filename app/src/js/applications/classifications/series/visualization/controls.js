import React from 'react';
import { withRouter } from 'react-router-dom';
import { goBack, ReturnButton, ActionToolbar } from '@inseefr/wilco';

function SeriesControls(props) {
	return (
		<ActionToolbar>
			<ReturnButton action={goBack(props, `/classifications/series`)} />
		</ActionToolbar>
	);
}

export default withRouter(SeriesControls);
