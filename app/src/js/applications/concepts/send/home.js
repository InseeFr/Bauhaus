import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { regexValidMail, allTagA, PageTitle } from '@inseefr/wilco';
import SendControls from './controls';
import { EditorHTML, LabelRequired } from 'bauhaus-utilities';
import D from 'js/i18n';

const getDefaultMessage = (appHost, id, label, isValidated) => {
	const params = [appHost, label, id];
	if (isValidated === 'false') {
		params.push('false');
	}
	return D.conceptMailDefault(params);
};

const isRecipientInsee = recipient => recipient.endsWith('@insee.fr');

const deleteRef = message => {
	return message.replace(allTagA, '');
};

class ConceptSend extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
		prefLabelLg1: PropTypes.string,
		properties: PropTypes.object.isRequired,
		isValidated: PropTypes.oneOf(['false', 'true']).isRequired,
		sendConcept: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);

		const {
			id,
			prefLabelLg1,
			isValidated,
			properties: { appHost, defaultMailSender },
		} = props;
		const recipient = '';
		this.state = {
			recipient,
			message: getDefaultMessage(appHost, id, prefLabelLg1, isValidated),
			sender: defaultMailSender,
			subject: D.conceptMailObjectDefault(prefLabelLg1),
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
				<PageTitle title={D.sendConceptTitle(prefLabelLg1)} />
				<SendControls
					isRecipientValid={this.isRecipientValid()}
					subject={subject}
					message={message}
					sendMessage={this.handleClickSend}
				/>
				<div className="form-group">
					<LabelRequired htmlFor="recipient">
						{D.mailRecipientTitle}
					</LabelRequired>
					<input
						id="recipient"
						type="email"
						className="form-control"
						value={recipient}
						onChange={e => this.handleRecipientChange(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="send">{D.mailSenderTitle}</label>
					<input
						id="sender"
						type="text"
						className="form-control"
						defaultValue={sender}
						disabled
					/>
				</div>
				<div className="form-group">
					<label htmlFor="subject">{D.mailObjectTitle}</label>
					<input
						id="subject"
						type="text"
						className="form-control"
						defaultValue={subject}
						onChange={e => this.handleSubjectChange(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="message">{D.mailTitle}</label>
					<EditorHTML
						ariaLabel={D.mailTitle}
						id="message"
						smart
						text={message}
						handleChange={this.handleMessageChange}
					/>
				</div>
			</div>
		);
	}
}

export default ConceptSend;
