import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import ConceptCreateControlLayout from './concept-create-control-layout';
import { maxLengthScopeNote } from 'config/config';
import { dictionary } from 'js/utils/dictionary';
import { htmlLength, htmlIsEmpty } from 'js/utils/html';

import { arrayKeepUniqueField } from 'js/utils/array-utils';
import { propTypes as notesPropTypes } from 'js/utils/concepts/notes';
import { propTypes as generalPropTypes } from 'js/utils/concepts/general';
import { propTypes as conceptsWithLinksPropTypes } from 'js/utils/concepts/links';

//TODO check logic (if not changed but not unique => ok ?)
//TODO check if we need to call deburr on concept labels
const checkPrefLabelFrExisting = (
  concepts,
  prefLabelLg1,
  initialPrefLabelFr
) => {
  return (
    //if it has not changed, it's ok
    prefLabelLg1 !== initialPrefLabelFr &&
    arrayKeepUniqueField(concepts, 'label').indexOf(
      deburr(prefLabelLg1.toLowerCase())
    ) !== -1
  );
};

const onlyFirst = (first, second) => !htmlIsEmpty(first) && htmlIsEmpty(second);

function ConceptCreateControl({
  oldGeneral,
  general,
  notes,
  conceptsWithLinks,
  handleSave,
  redirectCancel,
}) {
  let message;
  let saveEnabled = false;
  const { prefLabelLg1: initialPrefLabelFr } = oldGeneral;
  const { prefLabelLg1, creator, disseminationStatus } = general;
  const {
    definitionLg1,
    scopeNoteLg1,
    scopeNoteLg2,
    editorialNoteLg1,
    editorialNoteLg2,
    changeNoteLg1,
    changeNoteLg2,
  } = notes;

  const isPrefLabelFrExisting = checkPrefLabelFrExisting(
    conceptsWithLinks,
    prefLabelLg1,
    initialPrefLabelFr
  );
  //TODO check how to deal with notes like `<p></p>`: is it empty ?
  const isMissingConcept = !(prefLabelLg1 && creator && disseminationStatus);
  const isDefinitionFrMissing = htmlIsEmpty(definitionLg1);
  //TODO verify check on `disseminationStatus` works as expected
  const isStatusPublicAndDefinitionMissing =
    disseminationStatus.includes('Public') && htmlIsEmpty(scopeNoteLg1);
  const hasDefCourteEnNotFr = onlyFirst(scopeNoteLg2, scopeNoteLg1);
  const isDefCourteTooLong =
    htmlLength(scopeNoteLg1) > maxLengthScopeNote ||
    htmlLength(scopeNoteLg2) > maxLengthScopeNote;
  const hasNoteEditorialeEnNotFr = onlyFirst(
    editorialNoteLg2,
    editorialNoteLg1
  );
  const hasChangeNoteEnNotFr = onlyFirst(changeNoteLg2, changeNoteLg1);

  if (isPrefLabelFrExisting) {
    message = dictionary.warning.duplicated.label;
    //save disabled
  } else if (isMissingConcept) {
    message = dictionary.warning.missing.concept;
  } else if (isDefinitionFrMissing) {
    message = dictionary.warning.notes.definitionLg1;
  } else if (isStatusPublicAndDefinitionMissing) {
    message = dictionary.warning.notes.scopeNoteFr;
  } else if (hasDefCourteEnNotFr) {
    message = dictionary.warning.notes.scopeNote;
  } else if (isDefCourteTooLong) {
    message = dictionary.warning.notes.maxLengthScopeNote(maxLengthScopeNote);
  } else if (hasNoteEditorialeEnNotFr) {
    message = dictionary.warning.notes.editorialeNote;
  } else if (hasChangeNoteEnNotFr) {
    message = dictionary.warning.notes.changeNote;
  } else {
    //TODO missing else statement ? for instance if no creator ?
    //prefLabelLg1 && creator &&  disseminationStatus && !isLabelFrExisting &&
    //isDefinitionFr
    //no message
    saveEnabled = true;
  }
  return (
    <ConceptCreateControlLayout
      redirectCancel={redirectCancel}
      handleSave={handleSave}
      message={message}
      saveEnabled={saveEnabled}
    />
  );
}

ConceptCreateControl.propTypes = {
  oldGeneral: generalPropTypes.isRequired,
  general: generalPropTypes.isRequired,
  notes: notesPropTypes.isRequired,
  conceptsWithLinks: conceptsWithLinksPropTypes.isRequired,
  redirectCancel: PropTypes.string.isRequired,
  handleSave: PropTypes.func.isRequired,
};
export default ConceptCreateControl;
