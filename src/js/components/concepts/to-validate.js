import React from 'react';
import ConceptsPickerContainer from './picker-container';
import { dictionary } from 'js/utils/dictionary';
import { VALIDATE_CONCEPTS } from 'js/constants';

function ConceptsToValidate() {
  return (
    <ConceptsPickerContainer
      what={VALIDATE_CONCEPTS}
      title={dictionary.concepts.validation.title}
      panelTitle={dictionary.concepts.validation.panel}
      labelLoadable={dictionary.loadable.validation}
      labelWarning={dictionary.warning.validation.concepts}
      labelValidateButton={dictionary.buttons.validate}
    />
  );
}

export default ConceptsToValidate;
