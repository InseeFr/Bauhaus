import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Link, Redirect } from 'react-router-dom';

import { dictionary } from 'js/utils/dictionary';
import Panel from 'js/utils/panel';
import Pagination from 'js/components/shared/pagination';
import ConceptItem from './list-item';
import Loadable from 'react-loading-overlay';
import { filterDeburr } from 'js/utils/array-utils';
import addLogo from 'js/components/shared/logo-add';
import delLogo from 'js/components/shared/logo-del';
import { PENDING, OK } from 'js/constants';
import './picker.css';

class ConceptsPicker extends Component {
  constructor(props) {
    super(props);

    this.trackConcepts = concepts => {
      return (
        concepts &&
        concepts.map(({ id, label }) => ({
          id,
          label,
          isAdded: false,
        }))
      );
    };

    this.state = {
      searchLabel: '',
      goBackToConcepts: false,
      concepts: this.trackConcepts(this.props.concepts),
      waitingRemote: false,
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
        waitingRemote: true,
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.concepts !== this.props.concepts)
      this.setState({
        concepts: this.trackConcepts(nextProps.concepts),
      });
  }

  render() {
    const { searchLabel, waitingRemote } = this.state;
    const { status } = this.props;

    if (waitingRemote) {
      //remote call pending for this action
      //TODO we could use componentWillUnmout` to dispatch an action saying we are not
      //tracking this action anymore (for now, the `remoteCalls` reducer will
      //keep track of the last action performed).
      if (status === PENDING) {
        return (
          <Loadable
            active={true}
            spinner
            text={this.props.labelLoadable}
            color="#457DBB"
            background="grey"
            spinnerSize="400px"
          />
        );
      }
      if (status === OK) return <Redirect to="/concepts" />;
      //TODO customize error message
      return <div>Error while performing an action</div>;
    }

    const {
      concepts,
      title,
      panelTitle,
      labelWarning,
      labelValidateButton,
    } = this.props;

    if (!concepts) {
      return (
        <Loadable
          active={true}
          spinner
          //TODO use dictionary
          text="Loading concepts"
          color="#457DBB"
          background="grey"
          spinnerSize="400px"
        />
      );
    }

    //validation has not been asked yet
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
  ), //not required since this component can be created before the concepts are
  //loaded
  handleAction: PropTypes.func.isRequired,
};

export default ConceptsPicker;
