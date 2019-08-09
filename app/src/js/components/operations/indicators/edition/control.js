import React from 'react';
import {
	CancelButton,
	SaveButton,
} from 'js/components/shared/button-with-icon';
import ErrorBloc from 'js/components/shared/error-bloc';

function Control({ onSubmit, indicator, errorMessage }) {
	return (
		<div className="row btn-line action-toolbar">
			<CancelButton
				action={
					indicator.id
						? `/operations/indicator/${indicator.id}`
						: `/operations/indicators`
				}
			/>

			<ErrorBloc error={errorMessage} />

			<SaveButton action={onSubmit} disabled={errorMessage} />
		</div>
	);
}

export default Control;
