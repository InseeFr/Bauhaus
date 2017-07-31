import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import loadConceptList from 'js/actions/concepts/list';
import loadConceptLinks from 'js/actions/concepts/links';
import loadConceptGeneralAndNotes from 'js/actions/concepts/general-and-notes';
import loadDisseminationStatusList from 'js/actions/dissemination-status';
import loadStampList from 'js/actions/stamp';

import {
  BROADER,
  NARROWER,
  REFERENCES,
  SUCCEED,
  RELATED,
  NONE,
} from 'js/constants';
import emptyConcept from 'js/utils/concepts/empty-concept';
import { sortArray } from 'js/utils/array-utils';
import { PENDING, OK } from 'js/constants';
import { propTypes as generalPropTypes } from 'js/utils/concepts/general';
import { propTypes as notePropTypes } from 'js/utils/concepts/notes';
import { propTypes as conceptsWithLinksPropTypes } from 'js/utils/concepts/links';

const sortByLabel = sortArray('label');
//TODO retrieve all contextual information (`stampsList`,
//`dissemintationStatusList`, `conceptsList`) with a top level component for
//routes starting with `concepts/`, so sub components will not need to take care
//of loading this information.
class ConceptDetailsContainer extends Component {
  componentWillMount() {
    const {
      id,
      general,
      conceptsWithLinks,
      notes,
      conceptsList,
      stampsList,
      disseminationStatusList,
    } = this.props;
    if (id) {
      if (!(general && notes)) this.props.loadConceptGeneralAndNotes(id);
      if (!conceptsWithLinks) this.props.loadConceptLinks(id);
    }
    if (!conceptsList) this.props.loadConceptList();
    if (!stampsList) this.props.loadStampList();
    if (!disseminationStatusList) this.props.loadDisseminationStatusList();
  }

  render() {
    const { props } = this;
    const {
      id,
      general,
      conceptsWithLinks,
      notes,
      conceptsList,
      stampsList,
      disseminationStatusList,
      handleAction,
      trackAction,
      children,
    } = props;
    if (
      general &&
      conceptsWithLinks &&
      notes &&
      conceptsList &&
      stampsList &&
      disseminationStatusList
    ) {
      //intended to be used with `ConceptVisualization`, `ConceptEdition` or `ConceptCreation`
      return children({
        id,
        general,
        notes,
        conceptsWithLinks,
        stampsList,
        disseminationStatusList,
        handleAction,
        trackAction,
      });
    }
    return <div>Information is loading...</div>;
  }
}

ConceptDetailsContainer.propTypes = {
  id: PropTypes.string,
  children: PropTypes.func.isRequired,
  general: generalPropTypes,
  //TODO use dedicated prop types
  conceptsWithLinkks: conceptsWithLinksPropTypes,
  notes: notePropTypes,
  conceptsList: PropTypes.array,
  stampsList: PropTypes.array,
  disseminationStatusList: PropTypes.array,
  handleAction: PropTypes.func.isRequired,
  trackAction: PropTypes.oneOf([PENDING, OK]).isRequired, // track action progress before redirecting
};

//TODO this mapping should be defined only once
const linkTypes = {
  [BROADER]: BROADER,
  [NARROWER]: NARROWER,
  [REFERENCES]: REFERENCES,
  [SUCCEED]: SUCCEED,
  [RELATED]: RELATED,
};

const getType = typeOfLink => {
  const type = linkTypes[typeOfLink];
  if (type) return type;
  throw new TypeError(
    `The type of a link was not recognized: \`${typeOfLink}\``
  );
};

//TODO refactor (differentiate creation and update)
//TODO find a better way to organize the code, too much complexity exposed here,
//plus some redundancy (abstract extracting results from resource).
const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps;
  let general, conceptsList, conceptsWithLinks, notes, rawLinks;
  //loading concepts list
  const conceptsListResource = state.conceptsList;
  if (conceptsListResource && conceptsListResource.results) {
    conceptsList = sortByLabel(conceptsListResource.results);
  }
  //If `id` is provided, we are modifying an existing concept. It it's not, we
  //are creating a new concept
  if (!id) {
    const concept = emptyConcept();
    general = concept.general;
    rawLinks = concept.links;
    notes = concept.notes;
  } else {
    const { id } = ownProps;
    const generalResource = state.conceptGeneral[id];
    if (generalResource && generalResource.results) {
      general = generalResource.results;
    }
    if (general) {
      const notesAllVersions = state.conceptNotes[id];
      if (notesAllVersions) {
        const notesResource = notesAllVersions[general.conceptVersion];
        if (notesResource && notesResource.results) {
          notes = notesResource.results;
        }
      }
    }
    const rawLinksResource = state.conceptLinks[id];
    if (rawLinksResource && rawLinksResource.results) {
      rawLinks = rawLinksResource.results;
    }
  }
  //we need both `conceptsLits` and `rawLinks` to compute `conceptsWithLinkks``
  //we keep an entry for each concept in `coneptsList` and we add the additional
  //`typeOfLink` property.
  if (conceptsList && rawLinks) {
    conceptsWithLinks = conceptsList.map(({ id, label }) => {
      //TODO check if there is no performance issue here (it there are, we
      //could probably solve them by maintaining a dictionary of concepts).
      // check if the concept is linked to the actual concept
      const link = rawLinks.find(({ id: idLinked }) => idLinked === id);
      // and set `typeOfLink` accordingly
      const typeOfLink = link ? getType(link.typeOfLink) : NONE;
      //TODO we do not have `prefLabelLg1` and `prefLabelLg2` for concepts
      //not present in the links. Find a better way to do this.
      return {
        id,
        label,
        typeOfLink,
        prefLabelLg1: link && link.prefLabelLg1,
        prefLabelLg2: link && link.prefLabelLg2,
      };
    });
  }
  return {
    conceptsList,
    general,
    conceptsWithLinks,
    notes,
    stampsList: state.stampsList.results,
    disseminationStatusList: state.disseminationStatusList.results,
    trackAction: state.remoteCalls[ownProps.statusPropName],
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const actions = {
    loadConceptList,
    loadStampList,
    loadDisseminationStatusList,
    loadConceptGeneralAndNotes,
    loadConceptLinks,
    handleAction: ownProps.handleAction, //can be undefined for visualization
  };
  return bindActionCreators(actions, dispatch);
};

ConceptDetailsContainer = connect(mapStateToProps, mapDispatchToProps)(
  ConceptDetailsContainer
);

ConceptDetailsContainer.propTypes = {
  //if not provided => creation
  id: PropTypes.string,
  handleAction: PropTypes.func.isRequired,
  //name of the entry in `remoteCalls` reducer to track progress of the
  //action passed in with `handleAction`
  statusPropName: PropTypes.string.isRequired,
};

export default ConceptDetailsContainer;
