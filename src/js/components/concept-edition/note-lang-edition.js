import React from 'react';
import PropTypes from 'prop-types';
import { maxLengthScopeNote } from 'config/config';
import LogoWarning from 'js/components/shared/logo-warning';
import { dictionary } from 'js/utils/dictionary';

function EditNoteLang({ flag, note, handleChange }) {
  return (
    <div className="col-md-6">
      <div className="form-group centered">
        <label>
          {flag}
        </label>
        <ConceptModifyNotes note={note} onChange={handleChange} />
        <div>
          {editorLengthText(note)}
        </div>
        <div>
          {editorLength(note) > maxLengthScopeNote && <LogoWarning />}
        </div>
      </div>
    </div>
  );
}

NodeEdition.propTypes = {
  flag: PropTypes.element.isRequired,
  note: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};
