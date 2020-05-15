import React from 'react';
import { withRouter } from 'react-router-dom';
import { goBack, ReturnButton, ActionToolbar } from '@inseefr/wilco';

function CorrespondenceControls(props) {
	return (
		<ActionToolbar>
			<ReturnButton
				action={goBack(props, `/classifications/correspondences`)}
			/>
		</ActionToolbar>
	);
}

export default withRouter(CorrespondenceControls);
