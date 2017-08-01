import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import Loadable from 'react-loading-overlay';
import MenuConcepts from './menu';
import SendControls from './send-controls';
import EditorHtml from 'js/components/shared/editor-html';
import { dictionary } from 'js/utils/dictionary';
import { defaultMailSender } from 'config/config';
import { regexValidMail } from 'js/utils/regex';
import { PENDING, OK, ERROR } from 'js/constants';

const getDefaultMessage = (id, label, isValidated, recipient) => {
  //TODO fix me
  const params = [label, id];
  if (isValidated === 'Provisoire') {
    params.push('Provisoire');
  }
  if (isRecipientInsee(recipient)) {
    params.push('Insee');
  }
  const r = dictionary.concept.send.message.value(params);
  console.log(r);
  return r;
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
      creation: 'EDITION',
      sent: false,
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
      const data = {
        id: this.props.conceptGeneral.id,
        prefLabelLg1: this.props.conceptGeneral.prefLabelLg1,
        recipient: this.state.recipient,
        sender: this.state.sender,
        subject: this.state.subject,
        message: this.state.message,
      };
      this.props.sendConcept(data);
      this.setState({
        sent: true,
      });
    };
  }

  render() {
    const { id, prefLabelLg1, statusSend } = this.props;
    const { sent, sender, subject, message } = this.state;
    let mainEl;
    //TODO why do we not return to the same page ?
    const urlBack = statusSend === OK ? '/concepts' : `/concept/${id}`;

    if (!sent) {
      mainEl = (
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
            urlBack={urlBack}
          />
          <div className="form-group">
            <label>
              {dictionary.concept.send.recipient}
            </label>
            <input
              type="email"
              className="form-control"
              onChange={e => this.handleRecipientChange(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>
              {dictionary.concept.send.sender}
            </label>
            <input
              type="text"
              className="form-control"
              defaultValue={sender}
              disabled
            />
          </div>
          <div className="form-group">
            <label>
              {dictionary.concept.send.subject.title}
            </label>
            <input
              type="text"
              className="form-control"
              defaultValue={subject}
              onChange={e => this.handleSubjectChange(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>
              {dictionary.concept.send.message.title}
            </label>
            <EditorHtml
              text={message}
              handleChange={this.handleMessageChange}
            />
          </div>
        </div>
      );
    } else {
      //message was sent
      const { sendStatus } = this.pops;

      if (sendStatus === PENDING) {
        mainEl = (
          <Loadable
            active={true}
            spinner
            text={dictionary.loadable.sending}
            color="#457DBB"
            background="grey"
            spinnerSize="400px"
          />
        );
      } else {
        //send status OK or ERROR

        const title =
          statusSend === OK
            ? dictionary.concept.send.success([prefLabelLg1])
            : dictionary.concept.send.failed([prefLabelLg1]);

        mainEl = (
          <div>
            <MenuConcepts />
            <div className="container">
              <div className="row centered">
                <div className="col-md-12">
                  <h2>
                    {title}
                  </h2>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <Link
                    className="btn btn-primary btn-lg col-md-2 col-md-offset-5"
                    to={'urlBack'}>
                    {dictionary.buttons.return}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }

    return (
      <div>
        <MenuConcepts />
        {mainEl}
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
  sendStatus: PropTypes.oneOf([PENDING, OK, ERROR]).isRequired,
};

export default ConceptSend;
