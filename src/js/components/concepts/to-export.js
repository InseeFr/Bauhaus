import React, { Component } from 'react';
import { connect } from 'react-redux';
import ConceptsPicker from './picker';
import { dictionary } from 'js/utils/dictionary';
import * as select from 'js/reducers';
import exportConcepts from 'js/actions/concepts/export-multi';
import loadConceptList from 'js/actions/concepts/list';

class ConceptsToExport extends Component {
  componentWillMount() {
    if (!this.props.concepts) this.props.loadConceptList();
  }
  render() {
    const { concepts, exportConcepts, status } = this.props;
    return (
      <ConceptsPicker
        concepts={concepts}
        status={status}
        title={dictionary.concepts.export.title}
        panelTitle={dictionary.concepts.export.panel}
        labelLoadable={dictionary.loadable.exporting}
        labelWarning={dictionary.warning.export.concepts}
        labelValidateButton={dictionary.buttons.export}
        handleAction={exportConcepts}
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
