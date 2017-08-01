import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Loadable from 'react-loading-overlay';
import { dictionary } from 'js/utils/dictionary';
import ConceptsSearchList from './search';
import loadStampList from 'js/actions/stamp';
import loadDisseminationStatusList from 'js/actions/dissemination-status';
import loadConceptSearchList from 'js/actions/concepts/search-list';
import { sortArray } from 'js/utils/array-utils';
import 'css/app.css';

const sortByLabel = sortArray('label');

class ConceptsSearchListContainer extends Component {
  componentWillMount() {
    this.props.loadConceptSearchList();
    this.props.loadStampList();
    this.props.loadDisseminationStatusList();
  }

  render() {
    const {
      conceptsSearchList,
      stampList,
      disseminationStatusList,
    } = this.props;

    if (!(conceptsSearchList && stampList && disseminationStatusList))
      return (
        <div>
          <Loadable
            active={true}
            spinner
            text={dictionary.loadable.loading}
            color="#457DBB"
            background="grey"
            spinnerSize="400px"
          />
        </div>
      );

    return (
      <ConceptsSearchList
        conceptsSearchList={conceptsSearchList}
        stampList={stampList}
        disseminationStatusList={disseminationStatusList}
      />
    );
  }
}

const mapStateToProps = state => {
  let conceptsSearchList, stampList, disseminationStatusList;
  const conceptsResource = state.conceptsSearchList;
  const stampsResource = state.stampList;
  const disseminationResource = state.disseminationStatusList;
  //TODO work on performance (selector)
  if (conceptsResource && conceptsResource.results) {
    conceptsSearchList = sortByLabel(
      conceptsResource.results.map(concept => ({
        id: concept.id,
        label: concept.prefLabelLg1,
        definition: concept.definitionLg1,
        createdDate: concept.createdDate,
        modifiedDate: concept.modifiedDate,
        creator: concept.creator,
        disseminationStatus: concept.disseminationStatus,
        validationStatus: concept.validationStatus,
      }))
    );
  }
  if (stampsResource && stampsResource.results) {
    stampList = stampsResource.results;
  }
  if (disseminationResource && disseminationResource.results) {
    disseminationStatusList = disseminationResource.results;
  }

  return {
    conceptsSearchList,
    stampList,
    disseminationStatusList,
  };
};

const mapDispatchToProps = {
  loadConceptSearchList,
  loadStampList,
  loadDisseminationStatusList,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(ConceptsSearchListContainer)
);
