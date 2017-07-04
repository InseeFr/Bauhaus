import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';
import SelectRmes from '../utils/select-rmes';
import DatePickerRmes from '../utils/date-picker-rmes';
import Loadable from 'react-loading-overlay';
import MenuConcepts from './menu-concepts';
import { dictionary } from '../utils/dictionary';
import Pagination from '../utils/pagination';
import {
  sortArray,
  filterByPrefLabelFr,
  filterByDefinitionFr,
  filterByCreator,
  filterByDisseminationStatus,
  filterByValidationStatus,
  filterByCreatedDate,
  filterByModifiedDate
} from '../utils/array-utils';
import { loadStampsList } from '../actions/stamps';
import { loadDisseminationStatusList } from '../actions/dissemination-status';
import { loadConceptsSearchList } from '../actions/concepts-search-list';
import '../../css/app.css';

const sortByLabel = sortArray('prefLabelFr');

class ConceptsSearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchLabel: '',
      searchDef: '',
      creator: '',
      dateStartCreate: '',
      dateEndCreate: '',
      dateStartModify: '',
      dateEndModify: '',
      disseminationStatus: '',
      validationStatus: ''
    };
    this.onClickReturn = () => {
      this.props.history.push('/concepts');
    };
    this.onClickInitialize = () => {
      this.setState({
        searchLabel: '',
        searchDef: '',
        creator: '',
        dateStartCreate: '',
        dateEndCreate: '',
        dateStartModify: '',
        dateEndModify: '',
        disseminationStatus: '',
        validationStatus: ''
      });
    };
    this.handleChangeSearchLabel = searchLabel => {
      this.setState({ searchLabel });
    };
    this.handleChangeSearchDef = searchDef => {
      this.setState({ searchDef });
    };
    this.changeSelectCreator = e => {
      this.setState({
        creator: e ? e.value : ''
      });
    };
    this.changeSelectValidationStatus = e => {
      this.setState({
        validationStatus: e ? e.value : ''
      });
    };
    this.changeSelectDisseminationStatus = e => {
      this.setState({
        disseminationStatus: e ? e.value : ''
      });
    };
    this.handleChangeStartCreate = dateStartCreate => {
      this.setState({
        dateStartCreate
      });
    };
    this.handleChangeEndCreate = dateEndCreate => {
      this.setState({
        dateEndCreate
      });
    };
    this.handleChangeStartModify = dateStartModify => {
      this.setState({
        dateStartModify
      });
    };
    this.handleChangeEndModify = dateEndModify => {
      this.setState({
        dateEndModify
      });
    };
  }

  componentWillMount() {
    this.props.loadConceptsSearchList();
    this.props.loadStampsList();
    this.props.loadDisseminationStatusList();
  }

  render() {
    const {
      conceptsSearchList,
      stampsList,
      disseminationStatusList
    } = this.props;
    const {
      searchLabel,
      searchDef,
      creator,
      disseminationStatus,
      validationStatus,
      dateStartCreate,
      dateEndCreate,
      dateStartModify,
      dateEndModify
    } = this.state;

    console.log(this.state);

    if (conceptsSearchList.length === 0)
      return (
        <div>
          <MenuConcepts />
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
      conceptsSearchList
        .filter(filterByPrefLabelFr(_.deburr(searchLabel)))
        .filter(filterByDefinitionFr(_.deburr(searchDef)))
        .filter(filterByCreator(_.deburr(creator)))
        .filter(filterByDisseminationStatus(_.deburr(disseminationStatus)))
        .filter(filterByValidationStatus(_.deburr(validationStatus)))
        .filter(filterByCreatedDate(dateStartCreate, dateEndCreate))
        .filter(filterByModifiedDate(dateStartModify, dateEndModify))
    ).map(item =>
      <li key={item.id} className="list-group-item">
        <Link to={'/concept/' + item.id}>
          {item.prefLabelFr}
        </Link>
      </li>
    );

    return (
      <div>
        <MenuConcepts />
        <div className="container">
          <div className="row">
            <div className="col-md-10 centered col-md-offset-1">
              <h2 className="page-title">
                {dictionary.concepts.search.title}
              </h2>
            </div>
          </div>
          <div className="row btn-line">
            <div className="col-md-2">
              <button
                type="button"
                className="btn btn-primary btn-lg col-md-12"
                onClick={this.onClickReturn}>
                <span
                  className="glyphicon glyphicon-menu-left"
                  aria-hidden="true"
                />{' '}
                {dictionary.buttons.return}
              </button>
            </div>
            <div className="col-md-2 pull-right">
              <button
                type="button"
                className="btn btn-primary btn-lg col-md-12"
                onClick={this.onClickInitialize}>
                <span
                  className="glyphicon glyphicon-flash"
                  aria-hidden="true"
                />{' '}
                {dictionary.buttons.initialize}
              </button>
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-12">
              <input
                value={searchLabel}
                onChange={e => this.handleChangeSearchLabel(e.target.value)}
                type="text"
                placeholder={dictionary.concepts.search.label}
                className="form-control"
              />
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-12">
              <input
                value={searchDef}
                onChange={e => this.handleChangeSearchDef(e.target.value)}
                type="text"
                placeholder={dictionary.concepts.search.definition}
                className="form-control"
              />
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-4">
              {stampsList.length > 0 &&
                <SelectRmes
                  className="form-control"
                  placeholder={dictionary.concept.stamps.defaultValue}
                  value={creator}
                  options={stampsList}
                  onChange={e => this.changeSelectCreator(e)}
                  searchable={true}
                />}
            </div>
            <div className="col-md-4">
              {disseminationStatusList.length > 0 &&
                <SelectRmes
                  className="form-control"
                  placeholder={
                    dictionary.concept.disseminationStatus.defaultValue
                  }
                  value={disseminationStatus}
                  options={disseminationStatusList}
                  field="label"
                  onChange={e => this.changeSelectDisseminationStatus(e)}
                  searchable={true}
                />}
            </div>
            <div className="col-md-4">
              {disseminationStatusList.length > 0 &&
                <SelectRmes
                  className="form-control"
                  placeholder={
                    dictionary.status.concept.validationStatus.defaultValue
                  }
                  value={validationStatus}
                  options={['Validé', 'Provisoire']}
                  onChange={e => this.changeSelectValidationStatus(e)}
                  searchable={true}
                />}
            </div>
          </div>
          <div className="row vertical-center">
            <div className="col-md-3 centered">
              <label>Concept créé entre le </label>
            </div>
            <div className="col-md-4">
              <DatePickerRmes
                value={dateStartCreate}
                onChange={this.handleChangeStartCreate}
                placement="bottom"
              />
            </div>
            <div className="col-md-1 centered">
              <label> et le </label>
            </div>
            <div className="col-md-4">
              <DatePickerRmes
                value={dateEndCreate}
                onChange={this.handleChangeEndCreate}
                placement="bottom"
              />
            </div>
          </div>
          <div className="row vertical-center">
            <div className="col-md-3 centered">
              <label>Concept modifié entre le </label>
            </div>
            <div className="col-md-4">
              <DatePickerRmes
                value={dateStartModify}
                onChange={this.handleChangeStartModify}
                placement="bottom"
              />
            </div>
            <div className="col-md-1 centered">
              <label> et le </label>
            </div>
            <div className="col-md-4">
              <DatePickerRmes
                value={dateEndModify}
                onChange={this.handleChangeEndModify}
                placement="bottom"
              />
            </div>
          </div>
          <div className="centered">
            <div>
              <h4>
                {singOrPluralResult(itemsList)}
              </h4>
            </div>
            <div>
              <Pagination items={itemsList} itemsPerPage="10" />
            </div>
          </div>
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
  conceptsSearchList: state.conceptsSearchList,
  stampsList: state.stampsList,
  disseminationStatusList: state.disseminationStatusList
});

const mapDispatchToProps = {
  loadConceptsSearchList,
  loadStampsList,
  loadDisseminationStatusList
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(ConceptsSearchList)
);
