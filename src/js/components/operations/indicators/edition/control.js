import React from 'react';
import D from 'js/i18n';
import Button from 'js/components/shared/button';

function Control({ onSubmit, indicator, errorMessage }) {
	return (
		<div className="row btn-line">
			<Button
				action={
					indicator.id
						? `/operations/indicator/${indicator.id}`
						: `/operations/indicators`
				}
				label={
					<React.Fragment>
						<span
							className="glyphicon glyphicon-floppy-remove"
							aria-hidden="true"
						/>
						<span> {D.btnCancel}</span>
					</React.Fragment>
				}
				context="operations"
				col={3}
			/>

			<div className="col-md-6 centered">
				<div
					style={{ visibility: errorMessage ? 'visible' : 'hidden' }}
					className="alert alert-danger bold"
					role="alert"
				>
					{/* HACK: if no content, the line height is set to 0 and the rest
	              of the page moves a little  */}
					{errorMessage || <span style={{ whiteSpace: 'pre-wrap' }}> </span>}
				</div>
			</div>
			<Button
				action={onSubmit}
				label={
					<React.Fragment>
						<span
							className="glyphicon glyphicon-floppy-disk"
							aria-hidden="true"
						/>
						<span> {D.btnSave}</span>
					</React.Fragment>
				}
				context="operations"
				disabled={errorMessage}
				col={3}
			/>
		</div>
	);
}

export default Control;
