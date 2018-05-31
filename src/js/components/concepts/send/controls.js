import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { goBack } from 'js/utils/redirection';
import D from 'js/i18n';

class SendControls extends Component {
	render() {
		const { isRecipientValid, subject, message, sendMessage } = this.props;

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
		const location = this.props.history.location.pathname;
		const nextLocation = location.replace('/send', '');

		return (
			<div className="row btn-line">
				<div className="col-md-2">
					<button
						type="button"
						className="btn btn-primary btn-lg col-md-12"
						onClick={goBack(this.props, nextLocation)}
					>
						{D.btnReturn}
					</button>
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
						{D.btnSend}
					</button>
				</div>
			</div>
		);
	}
}

SendControls.propTypes = {
	isRecipientValid: PropTypes.bool.isRequired,
	subject: PropTypes.string,
	message: PropTypes.string,
	sendMessage: PropTypes.func.isRequired,
};

export default withRouter(SendControls);
