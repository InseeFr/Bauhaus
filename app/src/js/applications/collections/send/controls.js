import React from 'react';
import { PropTypes } from 'prop-types';
import { Button } from 'bauhaus-library';
import D from 'js/i18n';

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
	if (!isRecipientValid) {
		warning = D.invalidMailAdress;
		disabled = true;
	} else if (!hasSubject) {
		warning = D.emptyMailObject;
		disabled = true;
	} else if (!hasMessage) {
		warning = D.emptyMailBody;
	}
	return (
		<div className="row btn-line">
			<Button label={D.btnReturn} action={urlBack} />
			<div className="col-md-8 centered">
				{warning && (
					<div className="alert alert-danger" role="alert">
						{warning}
					</div>
				)}
			</div>
			<Button label={D.btnSend} action={sendMessage} disabled={disabled} />
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
