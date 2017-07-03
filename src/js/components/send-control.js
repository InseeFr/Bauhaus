import React, { Component } from 'react';
import { dictionary } from '../utils/dictionary';

class SendControl extends Component {
  render() {
    const { attr, onChange, onChangeReturn } = this.props;

    if (!attr.isRecipientValid) {
      return (
        <div className="row btn-line">
          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-primary btn-lg col-md-12"
              onClick={onChangeReturn}
            >
              {dictionary.buttons.return}
            </button>
          </div>
          <div className="col-md-8 centered">
            <div className="alert alert-danger bold" role="alert">
              {dictionary.warning.send.mail}
            </div>
          </div>
          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-primary btn-lg col-md-12 pull-right"
              disabled
            >
              {dictionary.buttons.send}
            </button>
          </div>
        </div>
      );
    }

    if (!attr.object) {
      return (
        <div className="row btn-line">
          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-primary btn-lg col-md-12"
              onClick={onChangeReturn}
            >
              {dictionary.buttons.return}
            </button>
          </div>
          <div className="col-md-8 centered">
            <div className="alert alert-danger bold" role="alert">
              {dictionary.warning.send.object}
            </div>
          </div>
          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-primary btn-lg col-md-12 pull-right"
              disabled
            >
              {dictionary.buttons.send}
            </button>
          </div>
        </div>
      );
    }

    if (!attr.isMessage) {
      return (
        <div className="row btn-line">
          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-primary btn-lg col-md-12"
              onClick={onChangeReturn}
            >
              {dictionary.buttons.return}
            </button>
          </div>
          <div className="col-md-8 centered">
            <div className="alert alert-danger bold" role="alert">
              {dictionary.warning.send.body}
            </div>
          </div>
          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-primary btn-lg col-md-12"
              disabled
            >
              {dictionary.buttons.send}
            </button>
          </div>
        </div>
      );
    }

    if (attr.isRecipientValid && attr.object && attr.isMessage) {
      return (
        <div className="row btn-line">
          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-primary btn-lg col-md-12"
              onClick={onChangeReturn}
            >
              {dictionary.buttons.return}
            </button>
          </div>
          <div className="col-md-2 pull-right">
            <button
              type="button"
              className="btn btn-primary btn-lg col-md-12"
              onClick={onChange}
            >
              {dictionary.buttons.send}
            </button>
          </div>
        </div>
      );
    }
  }
}
export default SendControl;
