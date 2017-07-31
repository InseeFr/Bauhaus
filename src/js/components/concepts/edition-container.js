import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import * as select from 'js/reducers';
import loadConcept from 'js/actions/concepts/concept';
import loadConceptList from 'js/actions/concepts/list';
import loadDisseminationStatusList from 'js/actions/dissemination-status';
import loadStampList from 'js/actions/stamp';
import updateConcept from 'js/actions/concepts/update';
import ConceptEditionCreation from './edition-creation';
import buildExtract from 'js/utils/build-extract';
import { mergeWithAllConcepts } from 'js/utils/concepts/links';
import { dictionary } from 'js/utils/dictionary';

import PageTitle from 'js/components/shared/page-title';
const extractId = buildExtract('id');

class EditionContainer extends Component {
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
      updateStatus,
    } = this.props;
    if (concept && conceptList && stampList && disseminationStatusList) {
      const { general, notes, links } = concept;
      const conceptsWithLinks = mergeWithAllConcepts(conceptList, links);
      const pageTitle = (
        <PageTitle
          title={dictionary.concept.modify}
          subtitle={general.prefLabelLg1}
        />
      );
      return (
        <ConceptEditionCreation
          id={id}
          pageTitle={pageTitle}
          general={general}
          notes={notes}
          conceptsWithLinks={conceptsWithLinks}
          disseminationStatusList={disseminationStatusList}
          stampList={stampList}
          isActionProcessed={updateStatus}
          save={updateConcept}
        />
      );
    }
    return <div>data is loading...</div>;
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
    updateStatus: select.getStatus(state, 'update'),
  };
};

const mapDispatchToProps = {
  loadConcept,
  loadConceptList,
  loadDisseminationStatusList,
  loadStampList,
  updateConcept,
};

EditionContainer = connect(mapStateToProps, mapDispatchToProps)(
  EditionContainer
);

EditionContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

export default EditionContainer;
