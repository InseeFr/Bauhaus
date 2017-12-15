import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import SendControls from './send-controls';
import EditorHtml from 'js/components/shared/editor-html';
import { dictionary } from 'js/utils/dictionary';
import { defaultMailSender } from 'config/config';
import { regexValidMail } from 'js/utils/regex';

const getDefaultMessage = (id, label, isValidated, recipient) => {
	//TODO fix me
	const params = [label, id];
	if (isValidated === 'Provisoire') {
		params.push('Provisoire');
	}
	if (isRecipientInsee(recipient)) {
		params.push('Insee');
	}
	return dictionary.concept.send.message.value(params);
};

const isRecipientInsee = recipient => recipient.endsWith('@insee.fr');
class ConceptSend extends Component {
	constructor(props) {
		super(props);

		const { id, prefLabelLg1, isValidated } = props;
		const recipient = '';
		this.state = {
			recipient,
			showDefaultMessage: true,
			message: getDefaultMessage(id, prefLabelLg1, isValidated, recipient),
			sender: defaultMailSender,
			subject: dictionary.concept.send.subject.value([prefLabelLg1]),
		};

		this.isRecipientValid = () => regexValidMail.test(this.state.recipient);

		this.handleRecipientChange = recipient => {
			this.setState({ recipient }, () => {
				if (this.state.showDefaultMessage) {
					const { id, prefLabelLg1, isValidated } = props;
					const { recipient } = this.state;
					this.setState({
						message: getDefaultMessage(
							id,
							prefLabelLg1,
							isValidated,
							recipient
						),
					});
				}
			});
		};

		this.handleSubjectChange = subject => {
			this.setState({ subject });
		};

		this.handleMessageChange = message => {
			this.setState({
				hasMessageBeenChanged: true,
				message,
			});
		};

		this.handleClickSend = () => {
			const { id } = this.props;
			const { recipient, sender, subject, message } = this.state;
			const data = {
				sender,
				recipient,
				object: subject,
				message,
			};
			this.props.sendConcept(id, data);
			this.setState({
				sent: true,
			});
		};
	}

	render() {
		const { prefLabelLg1 } = this.props;
		const { recipient, sender, subject, message } = this.state;

		return (
			<div className="container">
				<div className="row">
					<div className="col-md-10 centered col-md-offset-1">
						<h2 className="page-title">
							{dictionary.concept.send.title([prefLabelLg1])}
						</h2>
					</div>
				</div>
				<SendControls
					isRecipientValid={this.isRecipientValid()}
					subject={subject}
					message={message}
					sendMessage={this.handleClickSend}
				/>
				<div className="form-group">
					<label>{dictionary.concept.send.recipient}</label>
					<input
						type="email"
						className="form-control"
						value={recipient}
						onChange={e => this.handleRecipientChange(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label>{dictionary.concept.send.sender}</label>
					<input
						type="text"
						className="form-control"
						defaultValue={sender}
						disabled
					/>
				</div>
				<div className="form-group">
					<label>{dictionary.concept.send.subject.title}</label>
					<input
						type="text"
						className="form-control"
						defaultValue={subject}
						onChange={e => this.handleSubjectChange(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label>{dictionary.concept.send.message.title}</label>
					<EditorHtml text={message} handleChange={this.handleMessageChange} />
				</div>
			</div>
		);
	}
}

ConceptSend.propTypes = {
	id: PropTypes.string.isRequired,
	prefLabelLg1: PropTypes.string,
	//TODO use constants
	isValidated: PropTypes.oneOf(['Provisoire', 'Validé']).isRequired,
	sendConcept: PropTypes.func.isRequired,
};

export default ConceptSend;
