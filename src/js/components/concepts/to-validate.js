import React, { Component } from 'react';
import { connect } from 'react-redux';
import ConceptsPicker from './picker';
import { VALIDATE_CONCEPT_LIST } from 'js/actions/constants';
import { dictionary } from 'js/utils/dictionary';
import * as select from 'js/reducers';
import validateConcepts from 'js/actions/concepts/validate';
import loadConceptValidateList from 'js/actions/concepts/validate-list';

class ConceptsToValidate extends Component {
  componentWillMount() {
    if (!this.props.concepts) this.props.loadConceptValidateList();
  }
  render() {
    const { concepts, status, validateConcepts } = this.props;
    return (
      <ConceptsPicker
        concepts={concepts}
        title={dictionary.concepts.validation.title}
        panelTitle={dictionary.concepts.validation.panel}
        labelLoadable={dictionary.loadable.validation}
        labelWarning={dictionary.warning.validation.concepts}
        labelValidateButton={dictionary.buttons.validate}
        status={status}
        handleAction={validateConcepts}
      />
    );
  }
}

const mapStateToProps = state => ({
  concepts: select.getConceptValidateList(state),
  status: select.getStatus(state, VALIDATE_CONCEPT_LIST),
});

const mapDispatchToProps = {
  loadConceptValidateList,
  validateConcepts,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConceptsToValidate);
