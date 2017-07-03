import React from 'react';
import { dictionary } from '../utils/dictionary';
import Panel from '../utils/panel';
import { dateTimeToDateString } from '../utils/utils';

function ConceptGeneral({ attr, english }) {
  var mapping = {
    altLabelFr: dictionary.concept.altLabel + ' (fr)',
  };
  if (attr.altLabelEn) {
    mapping = { ...mapping, altLabelEn: dictionary.concept.altLabel + ' (en)' };
  }
  mapping = {
    ...mapping,
    created: dictionary.concept.created,
    modified: dictionary.concept.modified,
    dateEnd: dictionary.concept.valid,
    conceptVersion: dictionary.concept.conceptVersion,
    creator: dictionary.concept.creator,
    contributor: dictionary.concept.contributor,
    disseminationStatus: dictionary.concept.disseminationStatus.title,
    additionnalMaterial: dictionary.concept.additionnalMaterial,
    isValidated: dictionary.concept.isValidated,
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <Panel title={dictionary.concept.general}>
          <ul>
            {Object.keys(mapping).map(fieldName => {
              if (attr.hasOwnProperty(fieldName)) {
                if (fieldName === 'altLabelEn' && !english) {
                  return null;
                }
                if (
                  fieldName === 'created' ||
                  fieldName === 'modified' ||
                  fieldName === 'dateEnd'
                ) {
                  return (
                    <li key={fieldName}>{`${mapping[
                      fieldName
                    ]} : ${dateTimeToDateString(attr[fieldName])}`}</li>
                  );
                }
                if (fieldName === 'additionnalMaterial') {
                  return (
                    <li key={fieldName}>
                      {`${mapping[fieldName]} : `}
                      <a href={attr[fieldName]} target="_blank">{`${attr[
                        fieldName
                      ]}`}</a>
                    </li>
                  );
                } else {
                  return (
                    <li key={fieldName}>{`${mapping[fieldName]} : ${attr[
                      fieldName
                    ]}`}</li>
                  );
                }
              } else return null;
            })}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

export default ConceptGeneral;
