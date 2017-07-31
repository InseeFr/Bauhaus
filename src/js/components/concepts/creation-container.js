import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as select from 'js/reducers';
import loadConceptList from 'js/actions/concepts/list';
import loadDisseminationStatusList from 'js/actions/dissemination-status';
import loadStampList from 'js/actions/stamp';
import createConcept from 'js/actions/concepts/create';
import ConceptEditionCreation from './edition-creation';
import { mergeWithAllConcepts } from 'js/utils/concepts/links';
import { dictionary } from 'js/utils/dictionary';
import emptyConcept from 'js/utils/concepts/empty-concept';
import PageTitle from 'js/components/shared/page-title';

class EditionContainer extends Component {
  componentWillMount() {
    const { conceptList, stampList, disseminationStatusList } = this.props;
    if (!conceptList) this.props.loadConceptList();
    if (!stampList) this.props.loadStampList();
    if (!disseminationStatusList) this.props.loadDisseminationStatusList();
  }

  render() {
    const {
      concept,
      conceptList,
      stampList,
      disseminationStatusList,
      creationStatus,
      createConcept,
    } = this.props;
    if (conceptList && stampList && disseminationStatusList) {
      const { general, notes, links } = concept;
      const conceptsWithLinks = mergeWithAllConcepts(conceptList, links);
      const pageTitle = <PageTitle title={dictionary.concept.create} />;
      return (
        <ConceptEditionCreation
          pageTitle={pageTitle}
          general={general}
          notes={notes}
          conceptsWithLinks={conceptsWithLinks}
          disseminationStatusList={disseminationStatusList}
          stampList={stampList}
          isActionProcessed={creationStatus}
          save={createConcept}
        />
      );
    }
    return <div>data is loading...</div>;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    concept: emptyConcept(),
    conceptList: select.getConceptList(state),
    stampList: select.getStampList(state),
    disseminationStatusList: select.getDisseminationStatusList(state),
    //TODO build appropriate selector
    creationStatus: select.getStatus(state, 'creation'),
  };
};

const mapDispatchToProps = {
  loadConceptList,
  loadDisseminationStatusList,
  loadStampList,
  createConcept,
};

EditionContainer = connect(mapStateToProps, mapDispatchToProps)(
  EditionContainer
);

export default EditionContainer;
