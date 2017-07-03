import React from 'react';
import { dictionary } from '../utils/dictionary';
import Panel from '../utils/panel';
import { dateTimeToDateString } from '../utils/utils';

function CollectionGeneral({ attr }) {

    const mapping = {
      created: dictionary.collection.created,
      modified: dictionary.collection.modified,
      creator: dictionary.collection.creator,
      contributor: dictionary.collection.contributor,
      isValidated: dictionary.collection.isValidated
    }
    return (
        <div>
          <Panel title={dictionary.collection.general}>
            <ul>
              { Object.keys(mapping).map(fieldName => {
                if (attr.hasOwnProperty(fieldName)) {
                  if(fieldName==='created' || fieldName==='modified') {
                    return <li key={fieldName}>{`${mapping[fieldName]} : ${dateTimeToDateString(attr[fieldName])}`}</li>
                  }
                  else {
                    return <li key={fieldName}>{`${mapping[fieldName]} : ${attr[fieldName]}`}</li>
                  }
                }
                else return null
              }) }
            </ul>
          </Panel>
        </div>
    )
}

export default CollectionGeneral
