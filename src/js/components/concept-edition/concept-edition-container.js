import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadConceptsList } from 'js/actions/concepts-list';
import { loadStampsList } from 'js/actions/stamps';
import { updateConcept, createConcept } from 'js/actions/concept';
import { PARENT, CHILD, REF, SUCCEED, RELATED, NONE } from 'js/constants';
import { loadDisseminationStatusList } from 'js/actions/dissemination-status';
import { loadConceptLinks } from 'js/actions/concept';
import { loadConceptGeneralAndNotes } from 'js/actions/concept';
import emptyConcept from 'js/utils/concepts/empty-concept';
import ConceptEdition from './concept-edition';
import { sortArray } from 'js/utils/array-utils';
import { dictionary } from 'js/utils/dictionary';
import PageTitle from 'js/components/shared/page-title';

const sortByLabel = sortArray('label');
//TODO retrieve all contextual information (`stampsList`,
//`dissemintationStatusList`, `conceptsList`) with a top level component for
//routes starting with `concepts/`, so sub components will not need to take care
//of loading this information.
class ConceptEditionContainer extends Component {
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
    if (!(general && notes)) this.props.loadConceptGeneralAndNotes(id);
    if (!conceptsWithLinks) this.props.loadConceptLinks(id);
    if (!conceptsList) this.props.loadConceptsList();
    if (!stampsList) this.props.loadStampsList();
    if (!disseminationStatusList) this.props.loadDisseminationStatusList();
  }

  render() {
    const { props } = this;
    const {
      general,
      conceptsWithLinks,
      notes,
      conceptsList,
      stampsList,
      disseminationStatusList,
    } = props;
    if (
      general &&
      conceptsWithLinks &&
      notes &&
      conceptsList &&
      stampsList &&
      disseminationStatusList
    ) {
      return (
        <ConceptEdition
          id={props.id}
          creation={props.creation}
          pageTitle={props.pageTitle}
          general={props.general}
          notes={props.notes}
          conceptsWithLinks={props.conceptsWithLinks}
          stampsList={props.stampsList}
          disseminationStatusList={props.disseminationStatusList}
          save={props.save}
        />
      );
    }
    return <div>Information is loading...</div>;
  }
}

ConceptEditionContainer.propTypes = {
  id: PropTypes.string,
  creation: PropTypes.bool,
  pageTitle: PropTypes.element,
  general: PropTypes.object,
  links: PropTypes.object,
  notes: PropTypes.object,
  conceptsList: PropTypes.array,
  stampsList: PropTypes.array,
  disseminationStatusList: PropTypes.array,
  save: PropTypes.func.isRequired,
};

//TODO this formatting should be made earlier. It was introduced to solve
//inconsistencies in type names, but we should not need that kind of mapping,
//we could use the inital constants.
const linkTypes = {
  memberParent: PARENT,
  memberEnfants: CHILD,
  memberRef: REF,
  memberSucceed: SUCCEED,
  memberLink: RELATED,
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
  const { creation } = ownProps;
  let general, conceptsList, conceptsWithLinks, notes, rawLinks, pageTitle;
  //loading concepts list
  const conceptsListResource = state.conceptsList;
  if (conceptsListResource && conceptsListResource.results) {
    conceptsList = sortByLabel(conceptsListResource.results);
  }
  //If `id` is provided, we are modifying an existing concept. It it's not, we
  //are creating a new concept
  if (creation) {
    const concept = emptyConcept();
    general = concept.general;
    rawLinks = concept.links;
    notes = concept.notes;
    pageTitle = <PageTitle title={dictionary.concept.create} />;
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
      pageTitle = (
        <PageTitle
          title={dictionary.concept.modify}
          subtitle={general.prefLabelFr}
        />
      );
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
    conceptsWithLinks = conceptsList.map(({ id, prefLabelFr: label }) => {
      //TODO check if there is no performance issue here (it there are, we
      //could probably solve them by maintaining a dictionary of concepts).
      // check if the concept is linked to the actual concept
      const link = rawLinks.find(({ idLinked }) => idLinked === id);
      // and set `typeOfLink` accordingly
      const typeOfLink = link ? getType(link.typeOfLink) : NONE;
      return {
        id,
        label,
        typeOfLink,
      };
    });
  }
  return {
    pageTitle,
    conceptsList,
    general,
    conceptsWithLinks,
    notes,
    stampsList: state.stampsList.results,
    disseminationStatusList: state.disseminationStatusList.results,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const actions = {
    loadConceptsList,
    loadStampsList,
    loadDisseminationStatusList,
    loadConceptGeneralAndNotes,
    loadConceptLinks,
    save: ownProps.creation ? createConcept : updateConcept,
  };
  return Object.keys(actions).reduce((wrapActions, actionName) => {
    wrapActions[actionName] = (...args) =>
      dispatch(actions[actionName](...args));
    return wrapActions;
  }, {});
};

ConceptEditionContainer = connect(mapStateToProps, mapDispatchToProps)(
  ConceptEditionContainer
);

ConceptEditionContainer.propTypes = {
  //if not provided => creation
  id: PropTypes.string,
};

export default ConceptEditionContainer;
