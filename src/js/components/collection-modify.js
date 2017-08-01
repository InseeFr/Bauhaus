import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import Loadable from 'react-loading-overlay';
import SelectRmes from 'js/utils/select-rmes';
import CollectionModifyControl from './collection-modify-control';
import { dictionary } from 'js/utils/dictionary';
import Panel from 'js/utils/panel';
import Pagination from 'js/components/shared/pagination';
import loadConceptList from '../actions/concepts/list';
import loadStampList from '../actions/stamp';
import { postModifiedCollections } from 'js/utils/remote-api';
import {
  sortArray,
  filterByPrefLabelFr,
  arrayKeepUniqueField,
  arrayDropUniqueField,
  arrayDifferenceByID,
} from 'js/utils/array-utils';
import fr from '../../img/fr.png';
import en from '../../img/en.png';
import add from '../../img/add.png';
import del from '../../img/del.png';
import buildExtract from 'js/utils/build-extract';

const extractId = buildExtract('id');

const sortByLabel = sortArray('prefLabelLg1');

class CollectionModify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchLabel: '',
      isLabelExisting: false,
      idCollection: '',
      created: '',
      prefLabelLg1: '',
      prefLabelLg2: '',
      creator: '',
      contributor: '',
      descriptionFr: '',
      descriptionEn: '',
      members: [],
      creation: 'EDITION',
    };

    this.handleChange = searchLabel => {
      this.setState({ searchLabel });
    };

    this.handleChange1 = prefLabelLg1 => {
      this.setState({ prefLabelLg1 });
      if (
        arrayKeepUniqueField(
          this.props.collectionsList,
          'prefLabelLg1'
        ).indexOf(_.deburr(prefLabelLg1.toLowerCase())) !== -1 &&
        prefLabelLg1 !== this.props.collectionGeneral.prefLabelLg1
      )
        this.setState({
          isLabelExisting: true,
        });
      else
        this.setState({
          isLabelExisting: false,
        });
    };
    this.handleChange2 = prefLabelLg2 => {
      this.setState({ prefLabelLg2 });
    };
    this.changeSelectCreator = e => {
      this.setState({
        creator: e ? e.value : '',
      });
    };
    this.handleChange3 = descriptionFr => {
      this.setState({ descriptionFr });
    };
    this.handleChange4 = descriptionEn => {
      this.setState({ descriptionEn });
    };

    this.OnClickAddMember = e => {
      this.setState({
        members: [...this.state.members, e],
      });
    };
    this.OnClickDelMember = e => {
      this.setState({
        members: _.pull(this.state.members, e),
      });
    };
    this.return = () => {
      this.props.history.push('/collection/' + this.state.idCollection);
    };
    this.editCollectionData = () => {
      const data = {
        idCollection: this.state.idCollection,
        created: this.state.created,
        prefLabelLg1: this.state.prefLabelLg1,
        prefLabelLg2: this.state.prefLabelLg2,
        creator: this.state.creator,
        contributor: this.state.contributor,
        descriptionFr: this.state.descriptionFr,
        descriptionEn: this.state.descriptionEn,
        members: this.state.members,
      };
      if (this.state.prefLabelLg1 && !this.state.isLabelExisting) {
        this.setState({
          creation: 'PENDING',
        });
        postModifiedCollections(data.idCollection, data).then(() => {
          this.props.history.push('/collection/' + this.state.idCollection);
        });
      }
    };
  }

  componentWillMount() {
    this.props.loadConceptList();
    this.props.loadStampList();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      idCollection: nextProps.collectionGeneral.id,
      created: nextProps.collectionGeneral.created,
      prefLabelLg1: nextProps.collectionGeneral.prefLabelLg1,
      prefLabelLg2: nextProps.collectionGeneral.prefLabelLg2,
      creator: nextProps.collectionGeneral.creator,
      contributor: nextProps.collectionGeneral.contributor,
      descriptionFr: nextProps.collectionGeneral.descriptionFr,
      descriptionEn: nextProps.collectionGeneral.descriptionEn,
      members: arrayDropUniqueField(
        nextProps.collectionMembers,
        'prefLabelLg2'
      ),
    });
  }

  render() {
    const { collectionGeneral, conceptsList, stampList } = this.props;
    const {
      creator,
      searchLabel,
      members,
      creation,
      prefLabelLg1,
      isLabelExisting,
    } = this.state;

    const flagFr = <img src={fr} alt="fr" className="img-flag" />;
    const flagEn = <img src={en} alt="fr" className="img-flag" />;
    const logoAdd = <img src={add} alt="add" className="img-flag" />;
    const logoDel = <img src={del} alt="delete" className="img-flag" />;

    if (!conceptsList) return null;

    const potentialMembers = arrayDifferenceByID(conceptsList, members);

    const potentialMembersList = sortByLabel(
      potentialMembers.filter(filterByPrefLabelFr(_.deburr(searchLabel)))
    ).map(item =>
      <li
        key={item.id}
        className="list-group-item"
        onClick={e => this.OnClickAddMember(item)}>
        {logoAdd} {item.prefLabelLg1}
      </li>
    );

    const membersList = sortByLabel(members).map(item =>
      <li
        key={item.id}
        className="list-group-item"
        onClick={e => this.OnClickDelMember(item)}>
        {logoDel} {item.prefLabelLg1}
      </li>
    );

    console.log(creator);

    if (creation === 'PENDING' && prefLabelLg1 && !isLabelExisting) {
      return (
        <div>
          <Loadable
            active={true}
            spinner
            text={dictionary.loadable.save}
            color="#457DBB"
            background="grey"
            spinnerSize="400px"
          />
        </div>
      );
    }

    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-md-10 centered col-md-offset-1">
              <h2 className="page-title">
                {dictionary.collection.modify}
                <br />&quot; {collectionGeneral.prefLabelLg1} &quot;
              </h2>
            </div>
          </div>
          {this.state.idCollection &&
            <CollectionModifyControl
              attr={this.state}
              onChangeSave={this.editCollectionData}
              onChangeReturn={this.return}
            />}
          <div className="centered">
            <h4>
              ( <span className="boldRed">*</span> : {dictionary.requiredFields})
            </h4>
          </div>
          <div className="form-group">
            <label>
              {dictionary.collection.id} <span className="boldRed">*</span>
            </label>
            <input
              type="text"
              defaultValue={collectionGeneral.id}
              className="form-control"
              onChange={e => this.handleChangeId(e.target.value)}
              disabled
            />
          </div>
          <div className="form-group">
            <label>
              {dictionary.collection.label} ( {flagFr} ){' '}
              <span className="boldRed">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              defaultValue={collectionGeneral.prefLabelLg1}
              onChange={e => this.handleChange1(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>
              {dictionary.collection.label} ( {flagEn} )
            </label>
            <input
              type="text"
              className="form-control"
              defaultValue={collectionGeneral.prefLabelLg2}
              onChange={e => this.handleChange2(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>
              {dictionary.collection.creator} <span className="boldRed">*</span>
            </label>
            {stampList.length > 0 &&
              <SelectRmes
                className="form-control"
                placeholder={dictionary.collection.stamps.defaultValue}
                value={creator}
                options={stampList}
                onChange={e => this.changeSelectCreator(e)}
                searchable={true}
              />}
          </div>
          <div className="form-group">
            <label>
              {dictionary.collection.contributor}
            </label>
            <input
              type="text"
              className="form-control"
              defaultValue={collectionGeneral.contributor}
              disabled
            />
          </div>
          <div className="form-group">
            <label>
              {dictionary.collection.description} ( {flagFr} )
            </label>
            <textarea
              type="text"
              className="form-control"
              defaultValue={collectionGeneral.descriptionFr}
              onChange={e => this.handleChange3(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>
              {dictionary.collection.description} ( {flagEn} )
            </label>
            <textarea
              type="text"
              className="form-control"
              defaultValue={collectionGeneral.descriptionEn}
              onChange={e => this.handleChange4(e.target.value)}
            />
          </div>
          <div className="row">
            <div className="col-md-6">
              <Panel title={dictionary.collection.members}>
                {membersList}
              </Panel>
            </div>
            <div className="col-md-6 centered">
              <input
                value={searchLabel}
                onChange={e => this.handleChange(e.target.value)}
                type="text"
                placeholder={dictionary.collection.searchLabel}
                className="form-control"
              />
              <Pagination items={potentialMembersList} itemsPerPage="10" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const id = extractId(ownProps);
  return {
    collectionGeneral: state.collectionGeneral[id],
    collectionMembers: state.collectionMembers[id],
    conceptsList: state.conceptsList,
    collectionsList: state.collectionsList,
    stampList: state.stampList,
  };
};

const mapDispatchToProps = {
  loadConceptList,
  loadStampList,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(CollectionModify)
);
