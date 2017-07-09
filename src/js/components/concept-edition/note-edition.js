import React from 'react';
import PropTypes from 'prop-types';
import EditNoteLang from './edit-note-lang';
import flagFr from 'js/components/shared/flagFr';
import flagEn from 'js/components/shared/flagEn';
import { maxLengthScopeNote } from 'config/config';
import { dictionary } from 'js/utils/dictionary';

function NoteEdition({ noteFr, handleChangeFr, noteEn, handleChangeEn }) {
  return (
    <div className="col-md-6">
      <EditNoteLang flag={flagFr} note={noteFr} handleChange={handleChangeFr} />
      <EditNoteLang flag={flagEn} note={noteEn} handleChange={handleChangeEn} />
      <div className="row centered boldRed">
        {maxLengthScopeNote} {dictionary.maxLengthScopeNote}
      </div>
    </div>
  );
}

NoteEdition.propTypes = {
  noteFr: PropTypes.string.isRequired,
  noteEn: PropTypes.string.isRequired,
  handleChangeFr: PropTypes.func.isRequired,
  handleChangeEn: PropTypes.func.isRequired,
};

export default NoteEdition;
