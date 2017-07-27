import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ConceptsPicker from './concepts-picker';
import { sortArray } from 'js/utils/array-utils';
import { exportConcept } from 'js/actions/concepts-to-export';
import {
  loadConceptsToValidate,
  validateConcepts,
} from 'js/actions/concepts-to-validate';

import { loadConceptsList } from '../actions/concepts-list';

import { PropTypes } from 'prop-types';
import { EXPORT_CONCEPTS, VALIDATE_CONCEPTS } from 'js/constants';

const sortByLabel = sortArray('prefLabelLg1');

class ConceptsPickerContainer extends Component {
  componentWillMount() {
    if (!this.props.concepts) this.props.loadConcepts();
  }

  render() {
    const { concepts, handleAction, what, ...labels } = this.props;
    if (!concepts) return <div>Concepts are loading...</div>;
    return (
      <ConceptsPicker
        {...labels} /* status, title, panelTitle... */
        concepts={concepts}
        handleAction={handleAction}
      />
    );
  }
}

ConceptsPickerContainer.propTypes = {
  what: PropTypes.oneOf([EXPORT_CONCEPTS, VALIDATE_CONCEPTS]),
  panelTitle: PropTypes.string.isRequired,
  labelLoadable: PropTypes.string.isRequired,
  labelWarning: PropTypes.string.isRequired,
  labelValidateButton: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  let concepts, status;
  const { what } = ownProps;
  switch (what) {
    case EXPORT_CONCEPTS:
      if (state.conceptsList && state.conceptsList.results) {
        //TODO use a `compareLabel` function instead of `sortByLabel`
        //conceptsList.sort(compareLabel)
        concepts = sortByLabel(state.conceptsList.results);
      }
      status = state.remoteCalls.export;
      break;
    case VALIDATE_CONCEPTS:
      if (
        state.conceptsToValidateList &&
        state.conceptsToValidateList.results
      ) {
        concepts = sortByLabel(state.conceptsToValidateList.results);
      }
      status = state.remoteCalls.validation;
      break;
    default:
      throw new Error(
        `Invalid \`what\` ${what} prop passed to \`ConceptsPickerContainer\``
      );
  }

  return { concepts, status };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { what } = ownProps;
  let loadConcepts, handleAction;
  switch (what) {
    case EXPORT_CONCEPTS:
      loadConcepts = loadConceptsList;
      handleAction = ids => exportConcept(ids[0]);
      break;
    case VALIDATE_CONCEPTS:
      loadConcepts = loadConceptsToValidate;
      handleAction = validateConcepts;
      break;
    default:
      //there should be warging from prop types check
      throw new Error(
        `Invalid \`what\` ${what} prop passed to \`ConceptsPickerContainer\``
      );
  }
  return bindActionCreators(
    {
      loadConcepts,
      handleAction,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(
  ConceptsPickerContainer
);
