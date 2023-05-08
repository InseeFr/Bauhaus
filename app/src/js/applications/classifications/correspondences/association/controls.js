import React from 'react';
import { ReturnButton, ActionToolbar } from '@inseefr/wilco';
import { useRedirectWithDefault } from 'bauhaus-utilities';

function CorrespondenceControls(props) {
	const { correspondenceId } = props;
	const goBack = useRedirectWithDefault(
		`/classifications/correspondence/${correspondenceId}`
	);
	return (
		<ActionToolbar>
			<ReturnButton action={goBack} />
		</ActionToolbar>
	);
}

export default CorrespondenceControls;
