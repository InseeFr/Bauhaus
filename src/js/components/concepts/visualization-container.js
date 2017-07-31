import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import validateConcepts from 'js/actions/concepts/validate';
import * as select from 'js/reducers';
import buildExtract from 'js/utils/build-extract';
import loadConcept from 'js/actions/concepts/concept';
import loadConceptList from 'js/actions/concepts/list';
import loadDisseminationStatusList from 'js/actions/dissemination-status';
import loadStampList from 'js/actions/stamp';
import { mergeWithAllConcepts } from 'js/utils/concepts/links';
import ConceptVisualization from './visualization';
const extractId = buildExtract('id');

class ConceptVisualizationContainer extends Component {
  componentWillMount() {
    const {
      id,
      concept,
      conceptList,
      stampList,
      disseminationStatusList,
    } = this.props;
    if (!concept) this.props.loadConcept(id);
    if (!conceptList) this.props.loadConceptList();
    if (!stampList) this.props.loadStampList();
    if (!disseminationStatusList) this.props.loadDisseminationStatusList();
  }

  render() {
    const {
      id,
      concept,
      conceptList,
      stampList,
      disseminationStatusList,
      validationStatus,
      validateConcept,
    } = this.props;
    if (concept && conceptList && stampList && disseminationStatusList) {
      const { general, notes, links } = concept;
      //TODO should not stay here (part of the reducer ? in links edition ?)
      const conceptsWithLinks = mergeWithAllConcepts(conceptList, links);
      return (
        <ConceptVisualization
          id={id}
          general={general}
          notes={notes}
          conceptsWithLinks={conceptsWithLinks}
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
    conceptList: select.getConceptList(state),
    stampList: select.getStampList(state),
    disseminationStatusList: select.getDisseminationStatusList(state),
    //TODO build appropriate selector
    validationStatus: select.getStatus(state, 'validation'),
  };
};

const mapDispatchToProps = {
  loadConcept,
  loadConceptList,
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
