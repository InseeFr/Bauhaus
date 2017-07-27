import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import FileSaver from 'file-saver';
import MenuConcepts from './menu-concepts';
import { dictionary } from 'js/utils/dictionary';
import Panel from 'js/utils/panel';
import Pagination from 'js/components/shared/pagination';
import Loadable from 'react-loading-overlay';
import { sortArray, filterByPrefLabelFr } from 'js/utils/array-utils';
import { postCollectionsToExport } from 'js/utils/remote-api';
import add from '../../img/add.png';
import del from '../../img/del.png';

const sortByLabel = sortArray('prefLabelLg1');

class CollectionsToExport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchLabel: '',
      potentialCollectionsToExport: this.props.collectionsList,
      collectionsToExport: [],
      validation: 'WAITING',
    };
    this.handleChange = searchLabel => {
      this.setState({ searchLabel });
    };
    this.OnClickAddMember = e => {
      this.setState({
        collectionsToExport: [...this.state.collectionsToExport, e],
        potentialCollectionsToExport: _.pull(
          this.state.potentialCollectionsToExport,
          e
        ),
      });
    };
    this.OnClickDelMember = e => {
      this.setState({
        collectionsToExport: _.pull(this.state.collectionsToExport, e),
        potentialCollectionsToExport: [
          ...this.state.potentialCollectionsToExport,
          e,
        ],
      });
    };
    this.handleClickReturn = e => {
      e.preventDefault();
      this.props.history.push('/collections');
    };
    this.handleClickExport = e => {
      e.preventDefault();
      const data = {
        collectionsToExport: this.state.collectionsToExport,
      };
      this.setState({
        validation: 'PENDING',
      });
      postCollectionsToExport(data)
        .then(res => res.blob())
        .then(blob => {
          return FileSaver.saveAs(blob, `collections.ods`);
        })
        .then(() => {
          this.setState({
            validation: 'DONE',
          });
          this.props.history.push('/collections');
        });
    };
  }

  render() {
    const {
      searchLabel,
      potentialCollectionsToExport,
      collectionsToExport,
      validation,
    } = this.state;

    const logoAdd = <img src={add} alt="add" className="img-flag" />;
    const logoDel = <img src={del} alt="delete" className="img-flag" />;

    const itemsList = sortByLabel(
      potentialCollectionsToExport.filter(
        filterByPrefLabelFr(_.deburr(searchLabel))
      )
    ).map(item =>
      <li
        key={item.id}
        className="list-group-item"
        onClick={e => this.OnClickAddMember(item)}>
        {logoAdd} {item.prefLabelLg1}
      </li>
    );

    const collectionsToExportList = sortByLabel(collectionsToExport).map(item =>
      <li
        key={item.id}
        className="list-group-item"
        onClick={e => this.OnClickDelMember(item)}>
        {logoDel} {item.prefLabelLg1}
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
                {dictionary.collections.export.title}
              </h2>
            </div>
          </div>
          {collectionsToExport.length !== 0 &&
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
                  onClick={this.handleClickExport}>
                  {dictionary.buttons.export}
                </button>
              </div>
            </div>}
          {collectionsToExport.length === 0 &&
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
                  {dictionary.warning.export.collections}
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
              <Panel title={dictionary.collections.export.panel}>
                {collectionsToExportList}
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
  collectionsList: state.collectionsList,
});

export default connect(mapStateToProps)(withRouter(CollectionsToExport));
