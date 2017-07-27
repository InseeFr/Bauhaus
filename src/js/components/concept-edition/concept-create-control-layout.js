import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { dictionary } from 'js/utils/dictionary';

function ConceptCreateControlLayout({
  message,
  redirectCancel,
  handleSave,
  saveEnabled,
}) {
  return (
    <div className="row btn-line">
      <div className="col-md-2">
        <button type="button" className="btn btn-primary btn-lg col-md-12">
          <Link to={redirectCancel}>
            <span
              className="glyphicon glyphicon-floppy-remove"
              aria-hidden="true"
            />{' '}
            {dictionary.buttons.cancel}
          </Link>
        </button>
      </div>
      <div className="col-md-8 centered">
        <div
          style={{ visibility: message ? 'visible' : 'hidden' }}
          className="alert alert-danger bold"
          role="alert">
          {/* HACK: if no content, the line height is set to 0 and the rest
              of the page moves a little  */}
          {message || <span style={{ whiteSpace: 'pre-wrap' }}> </span>}
        </div>
      </div>
      <div className="col-md-2 pull-right">
        <button
          type="button"
          className="btn btn-primary btn-lg col-md-12"
          disabled={!saveEnabled}
          onClick={handleSave}>
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

ConceptCreateControlLayout.propTypes = {
  message: PropTypes.string,
  saveEnabled: PropTypes.bool.isRequired,
  redirectCancel: PropTypes.string.isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default ConceptCreateControlLayout;
