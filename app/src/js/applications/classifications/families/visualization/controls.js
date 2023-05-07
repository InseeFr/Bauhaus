import React from 'react';
import { ReturnButton, ActionToolbar } from '@inseefr/wilco';
import { useRedirectWithDefault } from 'bauhaus-utilities';


function FamilyControls() {
	const redirect = useRedirectWithDefault(`/classifications/families`);
	return (
		<ActionToolbar>
			<ReturnButton action={() => redirect()} />
		</ActionToolbar>
	);
}

export default FamilyControls;
