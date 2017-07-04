import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import MenuConcepts from './menu-concepts';
import { dictionary } from '../utils/dictionary';
import Panel from '../utils/panel';
import Pagination from '../utils/pagination';
import Loadable from 'react-loading-overlay';
import { sortArray, filterByPrefLabelFr } from '../utils/array-utils';
import { postCollectionsToValidate } from '../utils/remote-api';
import add from '../../img/add.png';
import del from '../../img/del.png';

const sortByLabel = sortArray('prefLabelFr');

class CollectionsToValidate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchLabel: '',
      potentialCollectionsToValid: this.props.collectionsToValidateList,
      collectionsToValid: [],
      validation: 'WAITING'
    };
    this.handleChange = searchLabel => {
      this.setState({ searchLabel });
    };
    this.OnClickAddMember = e => {
      this.setState({
        collectionsToValid: [...this.state.collectionsToValid, e],
        potentialCollectionsToValid: _.pull(
          this.state.potentialCollectionsToValid,
          e
        )
      });
    };
    this.OnClickDelMember = e => {
      this.setState({
        collectionsToValid: _.pull(this.state.collectionsToValid, e),
        potentialCollectionsToValid: [
          ...this.state.potentialCollectionsToValid,
          e
        ]
      });
    };
    this.handleClickReturn = e => {
      e.preventDefault();
      this.props.history.push('/collections');
    };
    this.handleClickValid = e => {
      e.preventDefault();
      const data = {
        collectionsToValid: this.state.collectionsToValid
      };
      this.setState({
        validation: 'PENDING'
      });
      postCollectionsToValidate(data).then(() => {
        this.setState({
          validation: 'DONE'
        });
        this.props.history.push('/collections');
      });
    };
  }

  render() {
    const {
      searchLabel,
      potentialCollectionsToValid,
      collectionsToValid,
      validation
    } = this.state;

    const logoAdd = <img src={add} alt="add" className="img-flag" />;
    const logoDel = <img src={del} alt="delete" className="img-flag" />;

    const itemsList = sortByLabel(
      potentialCollectionsToValid.filter(
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

    const collectionsToValidList = sortByLabel(collectionsToValid).map(item =>
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
                {dictionary.collections.validation.title}
              </h2>
            </div>
          </div>
          {collectionsToValid.length !== 0 &&
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
          {collectionsToValid.length === 0 &&
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
                  {dictionary.warning.validation.collections}
                </div>
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-primary btn-lg col-md-12 pull-right"
                  onClick={this.handleClickModif}
                  disabled>
                  {dictionary.buttons.validate}
                </button>
              </div>
            </div>}
          <div className="row">
            <div className="col-md-6">
              <Panel title={dictionary.collections.validation.toValid}>
                {collectionsToValidList}
              </Panel>
            </div>
            <div className="col-md-6 centered">
              <input
                value={searchLabel}
                onChange={e => this.handleChange(e.target.value)}
                type="text"
                placeholder={dictionary.collections.searchLabel}
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
  collectionsToValidateList: state.collectionsToValidateList
});

export default connect(mapStateToProps)(withRouter(CollectionsToValidate));
