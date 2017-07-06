import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import Loadable from 'react-loading-overlay';
import { dictionary } from 'js/utils/dictionary';
import Pagination from 'js/components/shared/pagination';
import { LOADING, FAILURE } from 'js/constants';
import { sortArray, filterByPrefLabelFr } from 'js/utils/array-utils';
import {
  loadConceptsList,
  loadConceptsToValidateList,
} from '../actions/concepts-list';

const sortByLabel = sortArray('prefLabelFr');

class ConceptsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchLabel: '',
    };
    this.handleChangeSearchLabel = searchLabel => {
      this.setState({ searchLabel });
    };
  }

  componentWillMount() {
    if (!this.props.conceptsList) {
      this.props.loadConceptsList();
    }
    this.props.loadConceptsToValidateList();
  }

  render() {
    const { conceptsList } = this.props;
    const { searchLabel } = this.state;

    if (!conceptsList || conceptsList.status === LOADING) {
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

    if (conceptsList.status === FAILURE) {
      return (
        <div>
          Error : {conceptsList.err}
        </div>
      );
    }

    const conceptsListArr = conceptsList.results;
    const itemsList = sortByLabel(
      conceptsListArr.filter(filterByPrefLabelFr(_.deburr(searchLabel)))
    ).map(item =>
      <li key={item.id} className="list-group-item">
        <Link to={'/concept/' + item.id}>
          {item.prefLabelFr}
        </Link>
      </li>
    );
    return (
      <div>
        <div className="row form-group">
          <div className="col-md-12">
            <input
              value={searchLabel}
              onChange={e => this.handleChangeSearchLabel(e.target.value)}
              type="text"
              placeholder={dictionary.concepts.searchLabel}
              className="form-control"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Link to={'/concepts/search'}>
              <h3 className="glyphicon glyphicon-zoom-in inline"> </h3>
              <h3 className="inline">
                {dictionary.concepts.advancedSearch}
              </h3>
            </Link>
          </div>
        </div>
        <div className="row">
          <h4>
            {singOrPluralResult(itemsList)}
          </h4>
        </div>
        <div>
          <Pagination items={itemsList} itemsPerPage="10" />
        </div>
      </div>
    );
  }
}

function singOrPluralResult(list) {
  if (list.length > 1) return list.length + dictionary.concepts.results;
  else return list.length + dictionary.concepts.result;
}

const mapStateToProps = state => ({
  conceptsList: state.conceptsList,
  conceptsToValid: state.conceptsToValid,
});

const mapDispatchToProps = {
  loadConceptsList,
  loadConceptsToValidateList,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConceptsList);
