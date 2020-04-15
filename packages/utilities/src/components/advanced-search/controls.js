import React from 'react';
import { ActionToolbar, ReturnButton } from '@inseefr/wilco';
import ResetButton from '../reset-button';

export default ({ onClickReturn, initializeState }) => (
	<ActionToolbar>
		<ReturnButton action={onClickReturn} />
		<ResetButton action={initializeState} />
	</ActionToolbar>
);
