import React from 'react';
import { dictionary } from 'js/utils/dictionary';

function ConceptByIDButtons({
  attr,
  onClickReturn,
  onClickSend,
  onClickCompare,
  onClickModif,
  onClickValid,
}) {
  if (
    (!attr.conceptVersion || attr.conceptVersion < 2) &&
    attr.isValidated === 'Validé'
  ) {
    return (
      <div className="row but btn-line">
        <div className="col-md-2">
          <button
            className="btn btn-primary btn-lg col-md-12"
            onClick={onClickReturn}
          >
            {dictionary.buttons.return}
          </button>
        </div>
        <div className="col-md-2 col-md-offset-6">
          <button
            className="btn btn-primary btn-lg col-md-12"
            onClick={onClickSend}
          >
            {dictionary.buttons.send}
          </button>
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-primary btn-lg col-md-12"
            onClick={onClickModif}
          >
            {dictionary.buttons.modify}
          </button>
        </div>
      </div>
    );
  } else if (attr.conceptVersion > 1 && attr.isValidated === 'Validé') {
    return (
      <div className="row btn-line">
        <div className="col-md-2">
          <button
            className="btn btn-primary btn-lg col-md-12"
            onClick={onClickReturn}
          >
            {dictionary.buttons.return}
          </button>
        </div>
        <div className="col-md-2 col-md-offset-4">
          <button
            className="btn btn-primary btn-lg col-md-12"
            onClick={onClickSend}
          >
            {dictionary.buttons.send}
          </button>
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-primary btn-lg col-md-12"
            onClick={onClickCompare}
          >
            {dictionary.buttons.compare}
          </button>
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-primary btn-lg col-md-12"
            onClick={onClickModif}
          >
            {dictionary.buttons.modify}
          </button>
        </div>
      </div>
    );
  } else if (
    (!attr.conceptVersion || attr.conceptVersion < 2) &&
    attr.isValidated === 'Provisoire'
  ) {
    return (
      <div className="row btn-line">
        <div className="col-md-2">
          <button
            className="btn btn-primary btn-lg col-md-12"
            onClick={onClickReturn}
          >
            {dictionary.buttons.return}
          </button>
        </div>
        <div className="col-md-2 col-md-offset-4">
          <button
            className="btn btn-primary btn-lg col-md-12"
            onClick={onClickSend}
          >
            {dictionary.buttons.send}
          </button>
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-primary btn-lg col-md-12"
            onClick={onClickModif}
          >
            {dictionary.buttons.modify}
          </button>
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-primary btn-lg col-md-12"
            onClick={onClickValid}
          >
            {dictionary.buttons.validate}
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="row btn-line">
        <div className="col-md-2">
          <button
            className="btn btn-primary btn-lg col-md-12"
            onClick={onClickReturn}
          >
            {dictionary.buttons.return}
          </button>
        </div>
        <div className="col-md-2 col-md-offset-2">
          <button
            className="btn btn-primary btn-lg col-md-12"
            onClick={onClickSend}
          >
            {dictionary.buttons.send}
          </button>
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-primary btn-lg col-md-12"
            onClick={onClickCompare}
          >
            {dictionary.buttons.compare}
          </button>
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-primary btn-lg col-md-12"
            onClick={onClickModif}
          >
            {dictionary.buttons.modify}
          </button>
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-primary btn-lg col-md-12"
            onClick={onClickValid}
          >
            {dictionary.buttons.validate}
          </button>
        </div>
      </div>
    );
  }
}

export default ConceptByIDButtons;
