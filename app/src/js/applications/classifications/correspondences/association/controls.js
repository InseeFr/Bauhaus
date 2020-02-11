import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, ActionToolbar } from '@inseefr/ui';
import { goBack } from '@inseefr/ui/src/utils/redirection';
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
