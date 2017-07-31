import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Loadable from 'react-loading-overlay';
import MenuConcepts from './concepts/menu';
import SendControl from './concepts/send-controls';
import { EditorState } from 'draft-js';
import EditorHtml from 'js/components/shared/editor-html';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';
import { dictionary } from 'js/utils/dictionary';
import { defaultMailSender } from 'config/config';
import { postCollectionSend } from 'js/utils/remote-api';
import { regexValidMail } from 'js/utils/regex';
import buildExtract from 'js/utils/build-extract';

const extractId = buildExtract('id');

class CollectionSend extends Component {
  constructor(props) {
    super(props);

    var params = [
      this.props.collectionGeneral.prefLabelLg1,
      this.props.collectionGeneral.id,
    ];
    if (this.props.collectionGeneral.isValidated === 'Provisoire') {
      params.push('Provisoire');
    }
    var message = dictionary.collection.send.message.value(params);

    this.state = {
      recipient: '',
      isRecipientValid: false,
      isRecipientInsee: false,
      sender: defaultMailSender,
      object: dictionary.collection.send.object.value([
        this.props.collectionGeneral.prefLabelLg1,
      ]),
      message: EditorState.createWithContent(stateFromHTML(message)),
      isMessage: true,
      creation: 'EDITION',
    };

    this.handleChangeRec = recipient => {
      this.setState({ recipient });
      if (recipient.endsWith('@insee.fr')) {
        params.push('Insee');
        message = dictionary.collection.send.message.value(params);
        this.setState({
          message: EditorState.createWithContent(stateFromHTML(message)),
        });
      }
      if (!recipient.endsWith('@insee.fr') && params.includes('Insee')) {
        params.pop();
        message = dictionary.collection.send.message.value(params);
        this.setState({
          message: EditorState.createWithContent(stateFromHTML(message)),
        });
      }
      if (regexValidMail.test(recipient) === true) {
        this.setState({ isRecipientValid: true });
      } else {
        this.setState({ isRecipientValid: false });
      }
    };

    this.handleChangeObj = object => {
      this.setState({ object });
    };

    this.changeMessage = message => {
      this.setState({
        message,
        isMessage: message.getCurrentContent().hasText(),
      });
    };

    this.handleClickSend = e => {
      e.preventDefault();
      const data = {
        recipient: this.state.recipient,
        sender: this.state.sender,
        object: this.state.object,
        message: stateToHTML(this.state.message.getCurrentContent()),
        prefLabelLg1: this.props.collectionGeneral.prefLabelLg1,
        creator: this.props.collectionGeneral.creator,
        contributor: this.props.collectionGeneral.contributor,
      };
      this.setState({
        creation: 'PENDING',
      });
      postCollectionSend(data).then(isSent => isSent.text()).then(isSent => {
        if (isSent === 'true') {
          this.setState({
            creation: 'DONE',
          });
        } else {
          this.setState({
            creation: 'FAILED',
          });
        }
      });
    };
    this.handleClickReturn = e => {
      e.preventDefault();
      this.props.history.push('/collections');
    };
    this.handleClickReturnFailed = e => {
      e.preventDefault();
      this.props.history.push('/collection/' + extractId(this.props));
    };
  }

  render() {
    const { collectionGeneral } = this.props;
    const { sender, object, creation, message } = this.state;

    if (creation === 'PENDING') {
      return (
        <div>
          <MenuConcepts />
          <Loadable
            active={true}
            spinner
            text={dictionary.loadable.sending}
            color="#457DBB"
            background="grey"
            spinnerSize="400px"
          />
        </div>
      );
    }

    if (creation === 'DONE' || creation === 'FAILED') {
      const onClick =
        creation === 'DONE'
          ? this.handleClickReturn
          : this.handleClickReturnFailed;
      return (
        <div>
          <MenuConcepts />
          <div className="container">
            <div className="row centered">
              <div className="col-md-12">
                {creation === 'DONE' &&
                  <h2>
                    {dictionary.collection.send.success([
                      collectionGeneral.prefLabelLg1,
                    ])}
                  </h2>}
                {creation === 'FAILED' &&
                  <h2>
                    {dictionary.collection.send.failed([
                      collectionGeneral.prefLabelLg1,
                    ])}
                  </h2>}
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <button
                  className="btn btn-primary btn-lg col-md-2 col-md-offset-5"
                  onClick={onClick}>
                  {dictionary.buttons.return}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <MenuConcepts />
        <div className="container">
          <div className="row">
            <div className="col-md-10 centered col-md-offset-1">
              <h2 className="page-title">
                {dictionary.collection.send.title([
                  collectionGeneral.prefLabelLg1,
                ])}
              </h2>
            </div>
          </div>
          <SendControl
            attr={this.state}
            onChange={this.handleClickSend}
            onChangeReturn={this.handleClickReturn}
          />
          <div className="form-group">
            <label>
              {dictionary.collection.send.recipient}
            </label>
            <input
              type="email"
              className="form-control"
              onChange={e => this.handleChangeRec(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>
              {dictionary.collection.send.sender}
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
              {dictionary.collection.send.object.title}
            </label>
            <input
              type="text"
              className="form-control"
              defaultValue={object}
              onChange={e => this.handleChangeObj(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>
              {dictionary.collection.send.message.title}
            </label>
            <EditorHtml
              editor={message}
              onEditorChange={e => this.changeMessage(e)}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  collectionGeneral: state.collectionGeneral[extractId(ownProps)],
});

export default connect(mapStateToProps)(withRouter(CollectionSend));
