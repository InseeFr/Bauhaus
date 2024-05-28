import React from 'react';
import { ReturnButton, ActionToolbar } from '@inseefr/wilco';
import { useGoBack } from 'js/hooks/hooks';

function CorrespondenceControls(props) {
	const { correspondenceId } = props;
	const goBack = useGoBack();

	return (
		<ActionToolbar>
			<ReturnButton
				action={() =>
					goBack(`/classifications/correspondence/${correspondenceId}`)
				}
			/>
		</ActionToolbar>
	);
}

export default CorrespondenceControls;
