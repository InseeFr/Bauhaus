import React from 'react';
import { ReturnButton, ActionToolbar } from '@inseefr/wilco';
import { useGoBack } from '../../../../hooks/hooks';

function SeriesControls() {
	const goBack = useGoBack();
	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack(`/classifications/series`)} />
		</ActionToolbar>
	);
}

export default SeriesControls;
