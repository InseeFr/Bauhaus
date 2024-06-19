import React from 'react';
import { ActionToolbar, ReturnButton, ResetButton } from '@inseefr/wilco';

const AdvancedSearchControl = ({ onClickReturn, initializeState }) => (
	<ActionToolbar>
		<ReturnButton action={onClickReturn} />
		<ResetButton action={initializeState} />
	</ActionToolbar>
);
export default AdvancedSearchControl;
