import React, { Component } from 'react';
import { dictionary } from 'js/utils/dictionary';

class CollectionCreateControl extends Component {
  render() {
    const { attr, onChangeSave, onChangeReturn } = this.props;

    if (attr.isIDExisting) {
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
              {dictionary.warning.duplicated.id}
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
    } else if (
      attr.idCollection &&
      attr.prefLabelLg1 &&
      !attr.isIDExisting &&
      !attr.isLabelExisting &&
      attr.creator.length !== 0
    ) {
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
export default CollectionCreateControl;
