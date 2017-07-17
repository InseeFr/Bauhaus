import React from 'react';
import PropTypes from 'prop-types';
import ConceptEditionContainer from './concept-edition-container';
import { updateConcept, createConcept } from 'js/actions/concept';

export const ConceptEdit = () =>
  <ConceptEditionContainer save={updateConcept} />;

ConceptEdit.propTypes = {
  id: PropTypes.string.isRequired,
};

export const ConceptCreate = () =>
  <ConceptEditionContainer save={createConcept} />;
