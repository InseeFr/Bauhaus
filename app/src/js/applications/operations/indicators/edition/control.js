import React from 'react';
import { ActionToolbar, CancelButton, SaveButton } from '@inseefr/wilco';

function Control({ onSubmit, indicator, disabled }) {
	return (
		<ActionToolbar>
			<CancelButton
				action={
					indicator.id
						? `/operations/indicator/${indicator.id}`
						: `/operations/indicators`
				}
			/>

			<SaveButton action={onSubmit} disabled={disabled} />
		</ActionToolbar>
	);
}

export default Control;
