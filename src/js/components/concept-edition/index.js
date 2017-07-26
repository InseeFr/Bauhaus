import React from 'react';
import PropTypes from 'prop-types';
import ConceptDetailsContainer from './concept-details-container';
import ConceptEditionCreation from './concept-edition-creation';
import ConceptVisualization from './concept-visualization';
import PageTitle from 'js/components/shared/page-title';
import { updateConcept, createConcept } from 'js/actions/concept';
import buildExtract from 'js/utils/build-extract';
import { dictionary } from 'js/utils/dictionary';

const extractId = buildExtract('id');

//TODO share some code between creation and edition
export const ConceptEdition = props =>
  <ConceptDetailsContainer
    id={extractId(props)}
    handleAction={updateConcept}
    statusPropName="update">
    {({
      general,
      notes,
      conceptsWithLinks,
      stampsList,
      disseminationStatusList,
      id,
      handleAction,
      trackAction,
    }) => {
      //TODO fix me
      const pageTitle = (
        <PageTitle
          title={dictionary.concept.modify}
          subtitle={general.prefLabelFr}
        />
      );

      return (
        <ConceptEditionCreation
          id={id}
          pageTitle={pageTitle}
          general={general}
          notes={notes}
          conceptsWithLinks={conceptsWithLinks}
          disseminationStatusList={disseminationStatusList}
          stampsList={stampsList}
          isActionProcessed={trackAction}
          save={handleAction}
        />
      );
    }}
  </ConceptDetailsContainer>;

//should be called with route knowledge
ConceptEdition.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

//TODO creation, validation and update should be constants
export const ConceptCreation = () =>
  <ConceptDetailsContainer
    handleAction={createConcept}
    statusPropName="creation">
    {({
      general,
      notes,
      conceptsWithLinks,
      stampsList,
      disseminationStatusList,
      id,
      handleAction,
      trackAction,
    }) => {
      //TODO fix me
      const pageTitle = <PageTitle title={dictionary.concept.create} />;
      return (
        <ConceptEditionCreation
          id={id}
          creation
          pageTitle={pageTitle}
          general={general}
          notes={notes}
          conceptsWithLinks={conceptsWithLinks}
          disseminationStatusList={disseminationStatusList}
          stampsList={stampsList}
          isActionProcessed={trackAction}
          save={handleAction}
        />
      );
    }}
  </ConceptDetailsContainer>;

export { ConceptVisualization };
