import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import FileSaver from 'file-saver';
import MenuConcepts from './menu-concepts';
import { dictionary } from '../utils/dictionary';
import Panel from '../utils/panel';
import Pagination from './utils/pagination';
import Loadable from 'react-loading-overlay';
import { sortArray, filterByPrefLabelFr } from '../utils/array-utils';
import { postConceptsToExport } from '../utils/remote-api';
import add from '../../img/add.png';
import del from '../../img/del.png';

const sortByLabel = sortArray('prefLabelFr');

class ConceptsToExport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchLabel: '',
      potentialConceptsToExport: this.props.conceptsList,
      conceptsToExport: [],
      validation: 'WAITING'
    };
    this.handleChange = searchLabel => {
      this.setState({ searchLabel });
    };
    this.OnClickAddMember = e => {
      this.setState({
        conceptsToExport: [...this.state.conceptsToExport, e],
        potentialConceptsToExport: _.pull(
          this.state.potentialConceptsToExport,
          e
        )
      });
    };
    this.OnClickDelMember = e => {
      this.setState({
        conceptsToExport: _.pull(this.state.conceptsToExport, e),
        potentialConceptsToExport: [...this.state.potentialConceptsToExport, e]
      });
    };
    this.handleClickReturn = e => {
      e.preventDefault();
      this.props.history.push('/concepts');
    };
    this.handleClickExport = e => {
      e.preventDefault();
      const data = {
        conceptsToExport: this.state.conceptsToExport
      };
      this.setState({
        validation: 'PENDING'
      });
      postConceptsToExport(data)
        .then(res => res.blob())
        .then(blob => {
          return FileSaver.saveAs(blob, `concepts.ods`);
        })
        .then(() => {
          this.setState({
            validation: 'DONE'
          });
          this.props.history.push('/concepts');
        });
    };
  }

  render() {
    const {
      searchLabel,
      potentialConceptsToExport,
      conceptsToExport,
      validation
    } = this.state;

    const logoAdd = <img src={add} alt="add" className="img-flag" />;
    const logoDel = <img src={del} alt="delete" className="img-flag" />;

    const itemsList = sortByLabel(
      potentialConceptsToExport.filter(
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

    const conceptsToExportList = sortByLabel(conceptsToExport).map(item =>
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
            text={dictionary.loadable.exporting}
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
                {dictionary.concepts.export.title}
              </h2>
            </div>
          </div>
          {conceptsToExport.length !== 0 &&
            <div className="row row btn-line">
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
                  onClick={this.handleClickExport}>
                  {dictionary.buttons.export}
                </button>
              </div>
            </div>}
          {conceptsToExport.length === 0 &&
            <div className="row row btn-line">
              <div className="col-md-2">
                <button
                  className="btn btn-primary btn-lg col-md-12"
                  onClick={this.handleClickReturn}>
                  {dictionary.buttons.return}
                </button>
              </div>
              <div className="col-md-8 centered">
                <div className="alert alert-danger bold" role="alert">
                  {dictionary.warning.export.concepts}
                </div>
              </div>
              <div className="col-md-2">
                <button className="btn btn-primary btn-lg col-md-12" disabled>
                  {dictionary.buttons.export}
                </button>
              </div>
            </div>}
          <div className="row">
            <div className="col-md-6">
              <Panel title={dictionary.concepts.export.panel}>
                {conceptsToExportList}
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
  conceptsList: state.conceptsList
});

export default connect(mapStateToProps)(withRouter(ConceptsToExport));
