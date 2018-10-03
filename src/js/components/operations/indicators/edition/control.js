import React from 'react';
import D from 'js/i18n';
import Button from 'js/components/shared/button';
import { validate } from 'js/components/operations/indicators/edition/validation';

function Control(props) {
	const { onSubmit, indicator } = props;
	const message = validate(indicator);
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
			/>

			<div className="col-md-8 centered">
				<div
					style={{ visibility: message ? 'visible' : 'hidden' }}
					className="alert alert-danger bold"
					role="alert"
				>
					{/* HACK: if no content, the line height is set to 0 and the rest
	              of the page moves a little  */}
					{message || <span style={{ whiteSpace: 'pre-wrap' }}> </span>}
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
				disabled={message}
			/>
		</div>
	);
}

export default Control;
