import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import ConceptCreateControlLayout from './concept-create-control-layout';
import { maxLengthScopeNote } from 'config/config';
import { dictionary } from 'js/utils/dictionary';
import htmlLength from 'js/utils/html-length';
import isEmpty from 'js/utils/is-empty-html';

import { arrayKeepUniqueField } from 'js/utils/array-utils';
import { propTypes as notesPropTypes } from 'js/utils/concepts/notes';
import { propTypes as generalPropTypes } from 'js/utils/concepts/general';
import { propTypes as conceptsWithLinksPropTypes } from 'js/utils/concepts/links';

//TODO check logic (if not changed but not unique => ok ?)
//TODO check if we need to call deburr on concept labels
const checkPrefLabelFrExisting = (
  concepts,
  prefLabelFr,
  initialPrefLabelFr
) => {
  return (
    //if it has not changed, it's ok
    prefLabelFr !== initialPrefLabelFr &&
    arrayKeepUniqueField(concepts, 'label').indexOf(
      deburr(prefLabelFr.toLowerCase())
    ) !== -1
  );
};

const onlyFirst = (first, second) => !isEmpty(first) && isEmpty(second);

function ConceptCreateControl({
  oldGeneral,
  general,
  notes,
  conceptsWithLinks,
  handleSave,
  handleCancel,
}) {
  let message;
  let saveEnabled = false;
  const { prefLabelFr: initialPrefLabelFr } = oldGeneral;
  const { prefLabelFr, creator, disseminationStatus } = general;
  const {
    definitionFr,
    definitionCourteFr,
    definitionCourteEn,
    noteEditorialeFr,
    noteEditorialeEn,
    changeNoteFr,
    changeNoteEn,
  } = notes;

  const isPrefLabelFrExisting = checkPrefLabelFrExisting(
    conceptsWithLinks,
    prefLabelFr,
    initialPrefLabelFr
  );
  //TODO check how to deal with notes like `<p></p>`: is it empty ?
  const isMissingConcept = !(prefLabelFr && creator && disseminationStatus);
  const isDefinitionFrMissing = isEmpty(definitionFr);
  //TODO add status public check
  const isStatusPublicAndDefinitionMissing = isEmpty(definitionCourteFr);
  const hasDefCourteEnNotFr = onlyFirst(definitionCourteEn, definitionCourteFr);
  const isDefCourteTooLong =
    htmlLength(definitionCourteFr) > maxLengthScopeNote ||
    htmlLength(definitionCourteEn) > maxLengthScopeNote;
  const hasNoteEditorialeEnNotFr = onlyFirst(
    noteEditorialeEn,
    noteEditorialeFr
  );
  const hasChangeNoteEnNotFr = onlyFirst(changeNoteEn, changeNoteFr);

  if (isPrefLabelFrExisting) {
    message = dictionary.warning.duplicated.label;
    //save disabled
  } else if (isMissingConcept) {
    message = dictionary.warning.missing.concept;
  } else if (isDefinitionFrMissing) {
    message = dictionary.warning.notes.definitionFr;
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
    //prefLabelFr && creator &&  disseminationStatus && !isLabelFrExisting &&
    //isDefinitionFr
    //no message
    saveEnabled = true;
  }
  return (
    <ConceptCreateControlLayout
      handleCancel={handleCancel}
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
  handleCancel: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};
export default ConceptCreateControl;
