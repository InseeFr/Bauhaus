import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loading-overlay';
import ConceptsHome from './concepts-home';
import { dictionary } from 'js/utils/dictionary';
import { NOT_LOADED, LOADED, LOADING, FAILURE } from 'js/constants';
import { loadConceptsList } from '../actions/concepts-list';
import { sortArray } from 'js/utils/array-utils';

class ConceptsHomeContainer extends Component {
  componentWillMount() {
    if (!this.props.conceptsList) {
      this.props.loadConceptsList();
    }
  }

  render() {
    const { concepts, status, err } = this.props;

    if (status === NOT_LOADED || status === LOADING) {
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
    }

    if (status === FAILURE) {
      return (
        <div>
          Error : {err}
        </div>
      );
    }

    return <ConceptsHome concepts={concepts} />;
  }
}

const sortByLabel = sortArray('label');
const mapStateToProps = state => {
  if (!state.conceptsList) {
    return {
      status: NOT_LOADED,
      concepts: [],
    };
  }
  //TODO should be sorted in the state, shouldn't they ?
  let { results: concepts, status, err } = state.conceptsList;
  if (status === LOADED) {
    concepts = sortByLabel(
      concepts.map(({ id, prefLabelFr: label }) => ({ id, label }))
    );
  }

  return {
    concepts,
    status,
    err,
  };
};

const mapDispatchToProps = {
  loadConceptsList,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  ConceptsHomeContainer
);
