import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import { dictionary } from 'js/utils/dictionary';

function SendControls({
	isRecipientValid,
	subject,
	message,
	sendMessage,
	urlBack,
}) {
	const hasSubject = Boolean(subject);
	const hasMessage = Boolean(message);
	let warning;
	let disabled;
	const { send: sendWarnings } = dictionary.warning;
	if (!isRecipientValid) {
		warning = sendWarnings.mail;
		disabled = true;
	} else if (!hasSubject) {
		warning = sendWarnings.subject;
		disabled = true;
	} else if (!hasMessage) {
		warning = sendWarnings.body;
	}
	return (
		<div className="row btn-line">
			<div className="col-md-2">
				<Link
					type="button"
					className="btn btn-primary btn-lg col-md-12"
					to={urlBack}
				>
					{dictionary.buttons.return}
				</Link>
			</div>
			<div className="col-md-8 centered">
				{warning && (
					<div className="alert alert-danger bold" role="alert">
						{warning}
					</div>
				)}
			</div>
			<div className="col-md-2">
				<button
					type="button"
					className="btn btn-primary btn-lg col-md-12 pull-right"
					onClick={sendMessage}
					disabled={disabled}
				>
					{dictionary.buttons.send}
				</button>
			</div>
		</div>
	);
}

SendControls.propTypes = {
	isRecipientValid: PropTypes.bool.isRequired,
	subject: PropTypes.string,
	message: PropTypes.string,
	urlBack: PropTypes.string,
	sendMessage: PropTypes.func.isRequired,
};

export default SendControls;
