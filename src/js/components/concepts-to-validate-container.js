import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import MenuConcepts from './menu-concepts';
import { dictionary } from 'js/utils/dictionary';
import Panel from 'js/utils/panel';
import Pagination from 'js/components/shared/pagination';
import Loadable from 'react-loading-overlay';
import { sortArray, filterByPrefLabelFr } from 'js/utils/array-utils';
import { postConceptsToValidate } from 'js/utils/remote-api';

const sortByLabel = sortArray('prefLabelFr');

class ConceptsToValidate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchLabel: '',
      potentialConceptsToValid: this.props.conceptsToValidateList,
      conceptsToValid: [],
      validation: 'WAITING',
    };
    this.handleChange = searchLabel => {
      this.setState({ searchLabel });
    };
    this.OnClickAddMember = e => {
      this.setState({
        conceptsToValid: [...this.state.conceptsToValid, e],
        potentialConceptsToValid: _.pull(
          this.state.potentialConceptsToValid,
          e
        ),
      });
    };
    this.OnClickDelMember = e => {
      this.setState({
        conceptsToValid: _.pull(this.state.conceptsToValid, e),
        potentialConceptsToValid: [...this.state.potentialConceptsToValid, e],
      });
    };
    this.handleClickReturn = e => {
      e.preventDefault();
      this.props.history.push('/concepts');
    };
    this.handleClickValid = e => {
      e.preventDefault();
      const data = {
        conceptsToValid: this.state.conceptsToValid,
      };
      this.setState({
        validation: 'PENDING',
      });
      postConceptsToValidate(data).then(() => {
        this.setState({
          validation: 'DONE',
        });
        this.props.history.push('/concepts');
      });
    };
  }

  render() {
    const {
      searchLabel,
      potentialConceptsToValid,
      conceptsToValid,
      validation,
    } = this.state;

    const logoAdd = <img src={add} alt="add" className="img-flag" />;
    const logoDel = <img src={del} alt="delete" className="img-flag" />;

    const itemsList = sortByLabel(
      potentialConceptsToValid.filter(
        filterByPrefLabelFr(_.deburr(searchLabel))
      )
    ).map(item =>
      <li
        key={item.id}
        className="list-group-item"
        onClick={e => this.OnClickAddMember(item)}>
        {logoAdd} {item.prefLabelFr}
      </li>
    );

    const conceptsToValidList = sortByLabel(conceptsToValid).map(item =>
      <li
        key={item.id}
        className="list-group-item"
        onClick={e => this.OnClickDelMember(item)}>
        {logoDel} {item.prefLabelFr}
      </li>
    );

    if (validation === 'PENDING') {
      return (
        <div>
          <MenuConcepts />
          <Loadable
            active={true}
            spinner
            text={dictionary.loadable.validation}
            color="#457DBB"
            background="grey"
            spinnerSize="400px"
          />
        </div>
      );
    }

    return (
      <div>
        <MenuConcepts />
        <div className="container">
          <div className="row">
            <div className="col-md-10 centered col-md-offset-1">
              <h2 className="page-title">
                {dictionary.concepts.validation.title}
              </h2>
            </div>
          </div>
          {conceptsToValid.length !== 0 &&
            <div className="row btn-line">
              <div className="col-md-2">
                <button
                  className="btn btn-primary btn-lg col-md-12"
                  onClick={this.handleClickReturn}>
                  {dictionary.buttons.return}
                </button>
              </div>
              <div className="col-md-2 pull-right">
                <button
                  className="btn btn-primary btn-lg col-md-12"
                  onClick={this.handleClickValid}>
                  {dictionary.buttons.validate}
                </button>
              </div>
            </div>}
          {conceptsToValid.length === 0 &&
            <div className="row btn-line">
              <div className="col-md-2">
                <button
                  className="btn btn-primary btn-lg col-md-12"
                  onClick={this.handleClickReturn}>
                  {dictionary.buttons.return}
                </button>
              </div>
              <div className="col-md-8 centered">
                <div className="alert alert-danger bold" role="alert">
                  {dictionary.warning.validation.concepts}
                </div>
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-primary btn-lg col-md-12"
                  onClick={this.handleClickModif}
                  disabled>
                  {dictionary.buttons.validate}
                </button>
              </div>
            </div>}
          <div className="row">
            <div className="col-md-6">
              <Panel title={dictionary.concepts.validation.panel}>
                {conceptsToValidList}
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
              <Pagination items={itemsList} itemsPerPage="10" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  conceptsToValidateList: state.conceptsToValidateList,
});

export default connect(mapStateToProps)(withRouter(ConceptsToValidate));
