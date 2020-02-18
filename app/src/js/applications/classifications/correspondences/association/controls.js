import React from 'react';
import { withRouter } from 'react-router-dom';
import { goBack, Button, ActionToolbar } from '@inseefr/wilco';
import D from 'js/i18n';

function CorrespondenceControls(props) {
	const { correspondenceId } = props;

	return (
		<ActionToolbar>
			<Button
				action={goBack(
					props,
					`/classifications/correspondence/${correspondenceId}`
				)}
				label={D.btnReturn}
			/>
		</ActionToolbar>
	);
}

export default withRouter(CorrespondenceControls);
