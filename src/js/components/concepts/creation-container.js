import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { CREATE_CONCEPT } from 'js/actions/constants';
import * as select from 'js/reducers';
import loadConceptList from 'js/actions/concepts/list';
import loadDisseminationStatusList from 'js/actions/dissemination-status';
import loadStampList from 'js/actions/stamp';
import createConcept from 'js/actions/concepts/create';
import buildPayloadCreation from 'js/utils/concepts/build-payload-creation-update/build-payload-creation';
import ConceptEditionCreation from './edition-creation';
import { mergeWithAllConcepts } from 'js/utils/concepts/links';
import { dictionary } from 'js/utils/dictionary';
import emptyConcept from 'js/utils/concepts/empty-concept';
import PageTitle from 'js/components/shared/page-title';
import Loadable from 'react-loading-overlay';
import { OK } from 'js/constants';

class CreationContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      creationRequested: false,
      id: '',
    };

    this.handleCreation = data => {
      this.props.createConcept(buildPayloadCreation(data));
      this.setState({
        creationRequested: true,
      });
    };
  }

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
    } = this.props;

    if (this.state.creationRequested) {
      if (creationStatus === OK) {
        return <Redirect to={`/concept/${this.props.id}`} />;
      } else
        return (
          <Loadable
            active={true}
            spinner
            text={dictionary.loadable.saving}
            color="#457DBB"
            background="grey"
            spinnerSize="400px"
          />
        );
    }
    if (conceptList && stampList && disseminationStatusList) {
      const { general, notes, links } = concept;
      const conceptsWithLinks = mergeWithAllConcepts(conceptList, links);
      const pageTitle = <PageTitle title={dictionary.concept.create} />;
      return (
        <ConceptEditionCreation
          creation
          pageTitle={pageTitle}
          general={general}
          notes={notes}
          conceptsWithLinks={conceptsWithLinks}
          disseminationStatusList={disseminationStatusList}
          stampList={stampList}
          isActionProcessed={creationStatus}
          save={this.handleCreation}
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
    id: select.getNewlyCreatedId(state),
    creationStatus: select.getStatus(state, CREATE_CONCEPT),
  };
};

const mapDispatchToProps = {
  loadConceptList,
  loadDisseminationStatusList,
  loadStampList,
  createConcept,
};

CreationContainer = connect(mapStateToProps, mapDispatchToProps)(
  CreationContainer
);

export default CreationContainer;
