import React from 'react';
import { ReturnButton, ActionToolbar } from '@inseefr/wilco';
import { useGoBack } from '../../../../hooks/hooks';

function CorrespondenceControls() {
	const goBack = useGoBack();
	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack('/classifications/correspondences')} />
		</ActionToolbar>
	);
}

export default CorrespondenceControls;
