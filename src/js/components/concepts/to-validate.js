import React, { Component } from 'react';
import { connect } from 'react-redux';
import ConceptsPicker from './picker';
import { dictionary } from 'js/utils/dictionary';
import * as select from 'js/reducers';
import validateConcepts from 'js/actions/concepts/validate';
import loadConceptValidateList from 'js/actions/concepts/validate-list';

class ConceptsToValidate extends Component {
  componentWillMount() {
    if (!this.props.concepts) this.props.loadConcepts();
  }
  render() {
    const { concepts, validateConcepts } = this.props;
    if (!concepts) return <div>Concepts are loading...</div>;
    return (
      <ConceptsPicker
        concepts={concepts}
        title={dictionary.concepts.validation.title}
        panelTitle={dictionary.concepts.validation.panel}
        labelLoadable={dictionary.loadable.validation}
        labelWarning={dictionary.warning.validation.concepts}
        labelValidateButton={dictionary.buttons.validate}
        handleAction={validateConcepts}
      />
    );
  }
}

const mapStateToProps = state => ({
  concepts: select.getConceptValidateList(state),
  status: select.getStatus(state, 'validation'),
});

const mapDispatchToProps = {
  loadConceptValidateList,
  validateConcepts,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConceptsToValidate);
