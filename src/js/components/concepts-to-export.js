import React from 'react';
import ConceptsPickerContainer from './concepts-picker-container';
import { dictionary } from 'js/utils/dictionary';
import { EXPORT_CONCEPTS } from 'js/constants';

function ConceptsToExport() {
  return (
    <ConceptsPickerContainer
      what={EXPORT_CONCEPTS}
      title={dictionary.concepts.export.title}
      panelTitle={dictionary.concepts.export.panel}
      labelLoadable={dictionary.loadable.exporting}
      labelWarning={dictionary.warning.export.concepts}
      labelValidateButton={dictionary.buttons.export}
    />
  );
}

export default ConceptsToExport;
