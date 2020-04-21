import React from 'react';
import { ActionToolbar, ReturnButton, ResetButton } from '@inseefr/wilco';

export default ({ onClickReturn, initializeState }) => (
	<ActionToolbar>
		<ReturnButton action={onClickReturn} />
		<ResetButton action={initializeState} />
	</ActionToolbar>
);
