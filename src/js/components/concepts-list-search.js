import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import { dictionary } from 'js/utils/dictionary';
import Pagination from 'js/components/shared/pagination';
import ConceptItem from './concept-item';
import { propTypes as overviewTypes } from 'js/utils/concepts/concept-overview';
import { filterKeyDeburr } from 'js/utils/array-utils';

const filter = filterKeyDeburr('label');

//TODO refactor to try to share some logic with `SearchConceptsByLabel`
//TODO search facility should not be handled by this component
class ConceptsListSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchLabel: '',
      hits: props.concepts,
    };
    this.handleSearch = label => {
      this.setState({
        hits: filter(this.props.concepts, this.state.searchLabel),
      });
    };
  }

  render() {
    const { searchLabel, hits } = this.state;
    const hitEls = hits.map(({ id, label }) =>
      <ConceptItem key={id} id={id} label={label} to={`/concept/${id}`} />
    );
    return (
      <div>
        <div className="row form-group">
          <div className="col-md-12">
            <input
              value={searchLabel}
              onChange={e => this.handleSearch(e.target.value)}
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
            {nbResults(hits)}
          </h4>
        </div>
        <div>
          <Pagination itemEls={hitEls} itemsPerPage="10" />
        </div>
      </div>
    );
  }
}

function nbResults(list) {
  if (list.length > 1) return list.length + dictionary.concepts.results;
  else return list.length + dictionary.concepts.result;
}

ConceptsListSearch.propTypes = {
  concepts: PropTypes.arrayOf(overviewTypes).isRequired,
};

export default ConceptsListSearch;
