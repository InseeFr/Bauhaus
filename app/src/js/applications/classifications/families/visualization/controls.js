import React from 'react';
import { ReturnButton, ActionToolbar } from '@inseefr/wilco';
import { useGoBack } from '../../../../hooks/hooks';

function FamilyControls() {
	const goBack = useGoBack();
	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack(`/classifications/families`)} />
		</ActionToolbar>
	);
}

export default FamilyControls;
