import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import MenuConcepts from './menu-concepts';
import { dictionary } from 'js/utils/dictionary';
import Panel from 'js/utils/panel';
import Pagination from 'js/components/shared/pagination';
import ConceptItem from 'js/components/concept-item';
import Loadable from 'react-loading-overlay';
import { filterDeburr } from 'js/utils/array-utils';
import addLogo from 'js/components/shared/logo-add';
import delLogo from 'js/components/shared/logo-del';
import { PENDING } from 'js/constants';
import './concepts-picker.css';

class ConceptsPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchLabel: '',
      goBackToConcepts: false,
      concepts: props.concepts.map(({ id, label }) => ({
        id,
        label,
        isAdded: false,
      })),
    };
    this.handleChange = searchLabel => {
      this.setState({ searchLabel });
    };

    this.addConcept = id => {
      const conceptsToValidate = this.state.concepts.map(concept => {
        //mutation, but not harmful here
        if (concept.id === id) concept.isAdded = true;
        return concept;
      });
      this.setState({
        conceptsToValidate,
      });
    };

    this.removeConcept = id => {
      const conceptsToValidate = this.state.concepts.map(concept => {
        //mutation, but not harmful here
        if (concept.id === id) concept.isAdded = false;
        return concept;
      });
      this.setState({
        conceptsToValidate,
      });
    };

    this.handleClickValid = e => {
      const added = this.state.concepts.filter(({ isAdded }) => isAdded);
      const addedIds = added.map(({ id }) => id);
      this.props.handleAction(addedIds);
      this.setState({
        goBackToConcepts: true,
      });
    };

    this.getConceptsByStatus = () => {
      const { concepts } = this.state;
      const check = filterDeburr(this.state.searchLabel);
      return concepts.reduce(
        (byStatus, { id, label, isAdded }) => {
          if (isAdded) byStatus.added.push({ id, label });
          else check(label) && byStatus.toAdd.push({ id, label });
          return byStatus;
        },
        { toAdd: [], added: [] }
      );
    };
  }

  render() {
    const { searchLabel, goBackToConcepts } = this.state;
    const {
      status,
      title,
      panelTitle,
      labelLoadable,
      labelWarning,
      labelValidateButton,
    } = this.props;

    if (status === PENDING) {
      return (
        <div>
          <MenuConcepts />
          <Loadable
            active={true}
            spinner
            text={labelLoadable}
            color="#457DBB"
            background="grey"
            spinnerSize="400px"
          />
        </div>
      );
    }
    if (goBackToConcepts) return <Redirect to="/concepts" />;

    const { toAdd, added } = this.getConceptsByStatus();

    const toAddEls = toAdd.map(({ id, label }) =>
      <ConceptItem
        key={id}
        id={id}
        label={label}
        logo={addLogo}
        handleClick={this.addConcept}
      />
    );

    const addedEls = added.map(({ id, label }) =>
      <ConceptItem
        key={id}
        id={id}
        label={label}
        logo={delLogo}
        handleClick={this.removeConcept}
      />
    );

    //The user has to add at least one concept
    const message =
      added.length === 0 &&
      <div className="col-md-8 centered">
        <div className="alert alert-danger bold" role="alert">
          {labelWarning}
        </div>
      </div>;

    const controls = (
      <div className="row btn-line">
        <div className="col-md-2">
          <button className="btn btn-primary btn-lg col-md-12">
            <Link to="/concepts">
              {dictionary.buttons.return}
            </Link>
          </button>
        </div>
        {message}
        <div className="col-md-2 pull-right">
          <button
            className="btn btn-primary btn-lg col-md-12"
            onClick={this.handleClickValid}
            disabled={added.length === 0}>
            {labelValidateButton}
          </button>
        </div>
      </div>
    );

    return (
      <div>
        <MenuConcepts />
        <div className="container">
          <div className="row">
            <div className="col-md-10 centered col-md-offset-1">
              <h2 className="page-title">
                {title}
              </h2>
            </div>
          </div>
          {controls}
          <div className="row">
            <div className="col-md-6">
              <Panel title={panelTitle}>
                {addedEls}
              </Panel>
            </div>
            <div className="col-md-6 centered">
              <input
                value={searchLabel}
                onChange={e => this.handleChange(e.target.value)}
                type="text"
                placeholder={dictionary.concepts.searchLabel}
                className="form-control"
              />
              <Pagination itemEls={toAddEls} itemsPerPage="10" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ConceptsPicker.propTypes = {
  title: PropTypes.string.isRequired,
  panelTitle: PropTypes.string.isRequired,
  labelLoadable: PropTypes.string.isRequired,
  labelWarning: PropTypes.string.isRequired,
  labelValidateButton: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  concepts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleAction: PropTypes.func.isRequired,
};

export default ConceptsPicker;
