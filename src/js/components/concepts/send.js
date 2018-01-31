import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import SendControls from './send-controls';
import EditorHtml from 'js/components/shared/editor-html';
import { dictionary } from 'js/utils/dictionary';
import { defaultMailSender } from 'config';
import { regexValidMail, tagA } from 'js/utils/regex';

const getDefaultMessage = (appHost, id, label, isValidated) => {
	const params = [appHost, label, id];
	if (isValidated === 'Provisoire') {
		params.push('Provisoire');
	}
	return dictionary.concept.send.message.value(params);
};

const isRecipientInsee = recipient => recipient.endsWith('@insee.fr');

const deleteRef = message => {
	return message.replace(tagA, '');
};

class ConceptSend extends Component {
	constructor(props) {
		super(props);

		const { id, prefLabelLg1, isValidated, appHost } = props;
		const recipient = '';
		this.state = {
			recipient,
			message: getDefaultMessage(appHost, id, prefLabelLg1, isValidated),
			sender: defaultMailSender,
			subject: dictionary.concept.send.subject.value([prefLabelLg1]),
		};

		this.isRecipientValid = () => regexValidMail.test(this.state.recipient);

		this.handleRecipientChange = recipient => this.setState({ recipient });

		this.handleSubjectChange = subject => this.setState({ subject });

		this.handleMessageChange = message => this.setState({ message });

		this.handleClickSend = () => {
			const { id } = this.props;
			const { recipient, sender, subject, message } = this.state;
			const data = {
				sender,
				recipient,
				object: subject,
				message: isRecipientInsee(recipient) ? message : deleteRef(message),
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
					<EditorHtml
						smart
						text={message}
						handleChange={this.handleMessageChange}
					/>
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
