import React, { Component } from 'react';
import { dictionary } from '../utils/dictionary';

class CollectionModifyControl extends Component {
  render() {
    const { attr, onChangeSave, onChangeReturn } = this.props;

    if (attr.isLabelExisting) {
      return (
        <div className="row btn-line">
          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-primary btn-lg col-md-12"
              onClick={onChangeReturn}
            >
              <span
                className="glyphicon glyphicon-floppy-remove"
                aria-hidden="true"
              />{' '}
              {dictionary.buttons.cancel}
            </button>
          </div>
          <div className="col-md-8 centered">
            <div className="alert alert-danger bold" role="alert">
              {dictionary.warning.duplicated.label}
            </div>
          </div>
          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-primary btn-lg col-md-12"
              disabled
            >
              <span
                className="glyphicon glyphicon-floppy-disk"
                aria-hidden="true"
              />{' '}
              {dictionary.buttons.save}
            </button>
          </div>
        </div>
      );
    } else if (attr.prefLabelFr && !attr.isLabelExisting && attr.creator) {
      return (
        <div className="row btn-line">
          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-primary btn-lg col-md-12"
              onClick={onChangeReturn}
            >
              <span
                className="glyphicon glyphicon-floppy-remove"
                aria-hidden="true"
              />{' '}
              {dictionary.buttons.cancel}
            </button>
          </div>
          <div className="col-md-2 pull-right">
            <button
              type="button"
              className="btn btn-primary btn-lg col-md-12"
              onClick={onChangeSave}
            >
              <span
                className="glyphicon glyphicon-floppy-disk"
                aria-hidden="true"
              />{' '}
              {dictionary.buttons.save}
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="row btn-line">
          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-primary btn-lg col-md-12"
              onClick={onChangeReturn}
            >
              <span
                className="glyphicon glyphicon-floppy-remove"
                aria-hidden="true"
              />{' '}
              {dictionary.buttons.cancel}
            </button>
          </div>
          <div className="col-md-8 centered">
            <div className="alert alert-danger bold" role="alert">
              {dictionary.warning.missing.collection}
            </div>
          </div>
          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-primary btn-lg col-md-12"
              disabled
            >
              <span
                className="glyphicon glyphicon-floppy-disk"
                aria-hidden="true"
              />{' '}
              {dictionary.buttons.save}
            </button>
          </div>
        </div>
      );
    }
  }
}
export default CollectionModifyControl;
