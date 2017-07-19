import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'react-bootstrap';
import NoteEdition from './note-edition';
import { dictionary } from 'js/utils/dictionary';
import { propTypes as notePropTypes } from 'js/utils/concepts/notes';
import { maxLengthScopeNote } from 'config/config';
import { htmlIsEmpty } from 'js/utils/html';

const noteTypes = [
  {
    rawTitle: dictionary.notes.scopeNote,
    // should be highlighted only if `definitionCourteFr` is empty and
    //`disseminationStatus.includes('Public')`
    redFrEmpty: disseminationStatus => disseminationStatus.includes('Public'),
    noteFrName: 'definitionCourteFr',
    noteEnName: 'definitionCourteEn',
    maxLength: maxLengthScopeNote,
  },
  {
    rawTitle: dictionary.notes.definition,
    redFrEmpty: () => true,
    noteFrName: 'definitionFr',
    noteEnName: 'definitionEn',
  },

  {
    rawTitle: dictionary.notes.editorialeNote,
    noteFrName: 'noteEditorialeFr',
    noteEnName: 'noteEditorialeEn',
  },
  {
    rawTitle: dictionary.notes.changeNote,
    noteFrName: 'changeNoteFr',
    noteEnName: 'changeNoteEn',
  },
];

//TODO handle red warnings for note tabs (see below)
//TODO handle `scopeNoteTabLabel`

// const scopeNoteTabLabel =
//   !isDefinitionCourteFr && disseminationStatus.includes('Public')
//     ? <div className="red">
//         {dictionary.notes.scopeNote}
//       </div>
//     : dictionary.notes.scopeNote;
// const definitionTabLabel = !isDefinitionFr
//   ? <div className="red">
//       {dictionary.notes.definition}
//     </div>
//   : dictionary.notes.definition;

// const versioningIsPossible =
//   isChangeNoteFr && isChangeNoteFrChanged ? true : false;
// const disabledVersioningButton = !versioningIsPossible;

//TODO structuring data in the state to make `fr` and `en` two attributes of an
//object might be a better option to organize the code efficiently.

const handleFieldChange = handleChange =>
  noteTypes.reduce((handlers, { noteFrName, noteEnName }) => {
    handlers[noteFrName] = value => handleChange({ [noteFrName]: value });
    handlers[noteEnName] = value => handleChange({ [noteEnName]: value });
    return handlers;
  }, {});

class NotesEdition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
    };
    this.handlers = handleFieldChange(this.props.handleChange);
    this.selectTab = tabIndex =>
      this.setState({
        activeTab: tabIndex,
      });
  }
  render() {
    const { notes, disseminationStatus } = this.props;
    const { activeTab } = this.state;
    return (
      <ul className="nav nav-tabs nav-justified">
        <Tabs defaultActiveKey={0} id="kindOfNote" onSelect={this.selectTab}>
          {noteTypes.map(
            (
              { rawTitle, noteFrName, noteEnName, redFrEmpty, maxLength },
              i
            ) => {
              const noteFr = notes[noteFrName];
              const noteEn = notes[noteEnName];
              //note fr empty and we value the `redFrEmptpy` function to know if
              //given the dissemination status, it should be highlighted or not
              let noteEdition;
              const highlight =
                redFrEmpty &&
                htmlIsEmpty(noteFr) &&
                redFrEmpty(disseminationStatus);
              const title = highlight
                ? <div className="red">
                    {rawTitle}
                  </div>
                : rawTitle;
              if (activeTab === i) {
                noteEdition = (
                  <NoteEdition
                    noteFr={noteFr}
                    noteEn={noteEn}
                    handleChangeFr={this.handlers[noteFrName]}
                    handleChangeEn={this.handlers[noteEnName]}
                    maxLength={maxLength}
                  />
                );
              }

              return (
                <Tab
                  key={noteFrName}
                  eventKey={i}
                  title={title}
                  style={{ marginTop: '20px' }}>
                  {noteEdition}
                  />
                </Tab>
              );
            }
          )}
        </Tabs>
      </ul>
    );
  }
}
NotesEdition.propTypes = {
  conceptGeneral: notePropTypes,
  disseminationStatus: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default NotesEdition;
