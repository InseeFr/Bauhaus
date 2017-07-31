import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ConceptsPicker from './picker';
import { sortArray } from 'js/utils/array-utils';
import exportMultipleConcepts from 'js/actions/concepts/export-multi';
import validateConcepts from 'js/actions/concepts/validate';
import loadConceptValidateList from 'js/actions/concepts/validate-list';

import loadConceptList from 'js/actions/concepts/list';

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
      if (state.conceptList && state.conceptList.results) {
        //TODO use a `compareLabel` function instead of `sortByLabel`
        //conceptList.sort(compareLabel)
        concepts = sortByLabel(state.conceptList.results);
      }
      status = state.remoteCalls.export;
      break;
    case VALIDATE_CONCEPTS:
      if (state.conceptToValidateList && state.conceptToValidateList.results) {
        concepts = sortByLabel(state.conceptToValidateList.results);
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
      loadConcepts = loadConceptList;
      //TODO update component to use something like
      //`ids.forEach(id => FileSaver.saveAs(blob, `${id}.pdf`)`)
      // to process the response
      handleAction = ids => exportMultipleConcepts(ids);
      break;
    case VALIDATE_CONCEPTS:
      loadConcepts = loadConceptValidateList;
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
