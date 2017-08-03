import React, { Component } from 'react';
import { connect } from 'react-redux';
import ConceptsPicker from './picker';
import { dictionary } from 'js/utils/dictionary';
import * as select from 'js/reducers';
import exportConcepts from 'js/actions/concepts/export-multi';
import loadConceptList from 'js/actions/concepts/list';

class ConceptsToExport extends Component {
  componentWillMount() {
    if (!this.props.concepts) this.props.loadConceptExportList();
  }
  render() {
    const { concepts, validateConcepts } = this.props;
    if (!concepts) return <div>Concepts are loading...</div>;
    return (
      <ConceptsPicker
        concepts={concepts}
        title={dictionary.concepts.export.title}
        panelTitle={dictionary.concepts.export.panel}
        labelLoadable={dictionary.loadable.exporting}
        labelWarning={dictionary.warning.export.concepts}
        labelValidateButton={dictionary.buttons.export}
        handleAction={validateConcepts}
      />
    );
  }
}

const mapStateToProps = state => ({
  concepts: select.getConceptList(state),
  status: select.getStatus(state, 'export'),
});

const mapDispatchToProps = {
  loadConceptList,
  exportConcepts,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConceptsToExport);
