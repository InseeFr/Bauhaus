import React from 'react';
import { withRouter } from 'react-router-dom';
import { goBack, ReturnButton, ActionToolbar } from '@inseefr/wilco';

function CorrespondenceControls(props) {
	const { correspondenceId } = props;

	return (
		<ActionToolbar>
			<ReturnButton
				action={goBack(
					props,
					`/classifications/correspondence/${correspondenceId}`
				)}
			/>
		</ActionToolbar>
	);
}

export default withRouter(CorrespondenceControls);
