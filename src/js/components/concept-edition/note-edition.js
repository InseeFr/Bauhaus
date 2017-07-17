import React from 'react';
import PropTypes from 'prop-types';
import NoteOneLangEdition from './note-one-lang-edition';
import flagFr from 'js/components/shared/flag-fr';
import flagEn from 'js/components/shared/flag-en';
import { dictionary } from 'js/utils/dictionary';

function NoteEdition({
  noteFr,
  handleChangeFr,
  noteEn,
  handleChangeEn,
  maxLength,
}) {
  return (
    <div>
      <div className="row">
        <div className="col-md-6">
          <NoteOneLangEdition
            flag={flagFr}
            note={noteFr}
            handleChange={handleChangeFr}
            maxLength={maxLength}
          />
        </div>
        <div className="col-md-6">
          <NoteOneLangEdition
            flag={flagEn}
            note={noteEn}
            handleChange={handleChangeEn}
            maxLength={maxLength}
          />
        </div>
      </div>
      {maxLength &&
        <div className="row">
          <div className="row centered boldRed">
            {maxLength} {dictionary.maxLengthScopeNote}
          </div>
        </div>}
    </div>
  );
}

NoteEdition.propTypes = {
  noteFr: PropTypes.string.isRequired,
  noteEn: PropTypes.string.isRequired,
  handleChangeFr: PropTypes.func.isRequired,
  handleChangeEn: PropTypes.func.isRequired,
  maxLength: PropTypes.number, // if not set, unbounded
};

export default NoteEdition;
