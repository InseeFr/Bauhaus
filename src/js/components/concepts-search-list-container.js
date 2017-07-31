import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Loadable from 'react-loading-overlay';
import MenuConcepts from 'js/components/menus/menu-concepts';
import { dictionary } from 'js/utils/dictionary';
import ConceptsSearchList from './concepts-search-list';
import { loadStampsList } from '../actions/stamps';
import { loadDisseminationStatusList } from '../actions/dissemination-status';
import { loadConceptsSearchList } from '../actions/concepts-search-list';
import { sortArray } from 'js/utils/array-utils';
import 'css/app.css';

const sortByLabel = sortArray('label');

class ConceptsSearchListContainer extends Component {
  componentWillMount() {
    this.props.loadConceptsSearchList();
    this.props.loadStampsList();
    this.props.loadDisseminationStatusList();
  }

  render() {
    const {
      conceptsSearchList,
      stampsList,
      disseminationStatusList,
    } = this.props;

    if (!(conceptsSearchList && stampsList && disseminationStatusList))
      return (
        <div>
          <MenuConcepts />
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
        stampsList={stampsList}
        disseminationStatusList={disseminationStatusList}
      />
    );
  }
}

const mapStateToProps = state => {
  let conceptsSearchList, stampsList, disseminationStatusList;
  const conceptsResource = state.conceptsSearchList;
  const stampsResource = state.stampsList;
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
    stampsList = stampsResource.results;
  }
  if (disseminationResource && disseminationResource.results) {
    disseminationStatusList = disseminationResource.results;
  }

  return {
    conceptsSearchList,
    stampsList,
    disseminationStatusList,
  };
};

const mapDispatchToProps = {
  loadConceptsSearchList,
  loadStampsList,
  loadDisseminationStatusList,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(ConceptsSearchListContainer)
);
