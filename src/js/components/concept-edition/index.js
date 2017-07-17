import React from 'react';
import PropTypes from 'prop-types';
import ConceptEditionContainer from './concept-edition-container';
import { updateConcept, createConcept } from 'js/actions/concept';
import buildExtract from 'js/utils/build-extract';

const extractId = buildExtract('id');

export const ConceptEdit = props =>
  <ConceptEditionContainer id={extractId(props)} save={updateConcept} />;

//should be called with route knowledge
ConceptEdit.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

export const ConceptCreate = () =>
  <ConceptEditionContainer creation save={createConcept} />;
