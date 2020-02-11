import React from 'react';
import {
	CancelButton,
	SaveButton,
	ErrorBloc,
	ActionToolbar,
} from '@inseefr/ui';

function Control({ onSubmit, indicator, errorMessage }) {
	return (
		<>
			<ActionToolbar>
				<CancelButton
					action={
						indicator.id
							? `/operations/indicator/${indicator.id}`
							: `/operations/indicators`
					}
				/>

				<SaveButton action={onSubmit} disabled={errorMessage} />
			</ActionToolbar>
			<ErrorBloc error={errorMessage} />
		</>
	);
}

export default Control;
