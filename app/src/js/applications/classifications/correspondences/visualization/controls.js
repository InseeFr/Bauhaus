import React from 'react';
import { ReturnButton, ActionToolbar } from '@inseefr/wilco';
import { useRedirectWithDefault } from 'bauhaus-utilities';

function CorrespondenceControls(props) {
	const goBack = useRedirectWithDefault(`/classifications/correspondences`);
	return (
		<ActionToolbar>
			<ReturnButton action={goBack} />
		</ActionToolbar>
	);
}

export default CorrespondenceControls;
