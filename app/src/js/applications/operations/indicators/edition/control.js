import React from 'react';
import { CancelButton, SaveButton, ErrorBloc } from 'bauhaus-library';

function Control({ onSubmit, indicator, errorMessage }) {
	return (
		<>
			<div className="row btn-line action-toolbar">
				<CancelButton
					action={
						indicator.id
							? `/operations/indicator/${indicator.id}`
							: `/operations/indicators`
					}
				/>

				<SaveButton action={onSubmit} disabled={errorMessage} />
			</div>
			<ErrorBloc error={errorMessage} />
		</>
	);
}

export default Control;
