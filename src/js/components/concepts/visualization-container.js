import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import validateConcepts from 'js/actions/concepts/validate';
import * as select from 'js/reducers';
import buildExtract from 'js/utils/build-extract';
import loadConcept from 'js/actions/concepts/concept';
import loadDisseminationStatusList from 'js/actions/dissemination-status';
import loadStampList from 'js/actions/stamp';
import ConceptVisualization from './visualization';
const extractId = buildExtract('id');

class ConceptVisualizationContainer extends Component {
  componentWillMount() {
    const { id, concept, stampList, disseminationStatusList } = this.props;
    if (!concept) this.props.loadConcept(id);
    if (!stampList) this.props.loadStampList();
    if (!disseminationStatusList) this.props.loadDisseminationStatusList();
  }

  render() {
    const {
      id,
      concept,
      stampList,
      disseminationStatusList,
      validationStatus,
      validateConcept,
    } = this.props;
    if (concept && stampList && disseminationStatusList) {
      const { general, notes, links } = concept;
      return (
        <ConceptVisualization
          id={id}
          general={general}
          notes={notes}
          links={links}
          stampList={stampList}
          disseminationStatusList={disseminationStatusList}
          validateConcept={validateConcept}
          validationStatus={validationStatus}
        />
      );
    }
    return <div>Information is loading...</div>;
  }
}

const mapStateToProps = (state, ownProps) => {
  const id = extractId(ownProps);
  return {
    id,
    concept: select.getConcept(state, id),
    stampList: select.getStampList(state),
    disseminationStatusList: select.getDisseminationStatusList(state),
    //TODO build appropriate selector
    validationStatus: select.getStatus(state, 'validation'),
  };
};

const mapDispatchToProps = {
  loadConcept,
  loadDisseminationStatusList,
  loadStampList,
  validateConcept: id => validateConcepts([id]),
};

ConceptVisualizationContainer = connect(mapStateToProps, mapDispatchToProps)(
  ConceptVisualizationContainer
);

ConceptVisualizationContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};
export default ConceptVisualizationContainer;
