import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import Loadable from 'react-loading-overlay';
import { dictionary } from '../utils/dictionary';
import Pagination from './utils/pagination';
import { sortArray, filterByPrefLabelFr } from '../utils/array-utils';
import {
  loadCollectionsList,
  loadCollectionsToValidateList,
} from '../actions/collections-list';

const sortByLabel = sortArray('prefLabelFr');

class CollectionsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchLabel: '',
    };
    this.handleChange = searchLabel => {
      this.setState({ searchLabel });
    };
  }

  componentWillMount() {
    this.props.loadCollectionsList();
    this.props.loadCollectionsToValidateList();
  }

  render() {
    const { collectionsList } = this.props;
    const { searchLabel } = this.state;

    if (collectionsList.length === 0)
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

    const itemsList = sortByLabel(
      collectionsList.filter(filterByPrefLabelFr(_.deburr(searchLabel)))
    ).map(item =>
      <li key={item.id} className="list-group-item">
        <Link to={'/collection/' + item.id}>
          {item.prefLabelFr}
        </Link>
      </li>
    );
    return (
      <div>
        <input
          value={searchLabel}
          onChange={e => this.handleChange(e.target.value)}
          type="text"
          placeholder={dictionary.collection.searchLabel}
          className="form-control"
        />
        <div>
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
  if (list.length > 1) return list.length + dictionary.collections.results;
  else return list.length + dictionary.collections.result;
}

const mapStateToProps = state => ({
  collectionsList: state.collectionsList,
});

const mapDispatchToProps = {
  loadCollectionsList,
  loadCollectionsToValidateList,
};

export default connect(mapStateToProps, mapDispatchToProps)(CollectionsList);
