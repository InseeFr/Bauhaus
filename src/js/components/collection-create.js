import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import Loadable from 'react-loading-overlay';
import MenuConcepts from './concepts/menu';
import SelectRmes from 'js/utils/select-rmes';
import { dictionary } from 'js/utils/dictionary';
import { defaultContributor } from 'config/config';
import Panel from 'js/utils/panel';
import Pagination from 'js/components/shared/pagination';
import CollectionCreateControl from './collection-create-controls';
import {
  sortArray,
  filterByPrefLabelFr,
  arrayKeepUniqueField,
} from 'js/utils/array-utils';
import { postCollections } from 'js/utils/remote-api';
import loadConceptList from '../actions/concepts/list';
import loadStampList from '../actions/stamp';
import fr from '../../img/fr.png';
import en from '../../img/en.png';
import add from '../../img/add.png';
import del from '../../img/del.png';
import 'css/app.css';

const sortByLabel = sortArray('prefLabelLg1');

class CollectionCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idCollection: '',
      isIDExisting: false,
      isLabelExisting: false,
      prefLabelLg1: '',
      prefLabelLg2: '',
      creator: '',
      contributor: defaultContributor,
      descriptionFr: '',
      descriptionEn: '',
      searchLabel: '',
      members: [],
      potentialMembers: this.props.conceptsList,
      creation: 'EDITION',
    };
    this.handleChangeId = idCollection => {
      this.setState({ idCollection });
      if (
        arrayKeepUniqueField(this.props.collectionsList, 'id').indexOf(
          _.deburr(idCollection.toLowerCase().split(' ').join(''))
        ) !== -1
      )
        this.setState({
          isIDExisting: true,
        });
      else
        this.setState({
          isIDExisting: false,
        });
    };
    this.handleChange1 = prefLabelLg1 => {
      this.setState({ prefLabelLg1 });
      if (
        arrayKeepUniqueField(
          this.props.collectionsList,
          'prefLabelLg1'
        ).indexOf(_.deburr(prefLabelLg1.toLowerCase())) !== -1
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
    this.handleChange = searchLabel => {
      this.setState({ searchLabel });
    };
    this.OnClickAddMember = e => {
      this.setState({
        members: [...this.state.members, e],
        potentialMembers: _.pull(this.state.potentialMembers, e),
      });
    };
    this.OnClickDelMember = e => {
      this.setState({
        members: _.pull(this.state.members, e),
        potentialMembers: [...this.state.potentialMembers, e],
      });
    };
    this.return = () => {
      this.props.history.push('/collections');
    };
    this.editCollectionData = () => {
      const data = {
        idCollection: this.state.idCollection,
        prefLabelLg1: this.state.prefLabelLg1,
        prefLabelLg2: this.state.prefLabelLg2,
        creator: this.state.creator,
        contributor: this.state.contributor,
        descriptionFr: this.state.descriptionFr,
        descriptionEn: this.state.descriptionEn,
        members: this.state.members,
      };
      if (
        this.state.idCollection &&
        this.state.prefLabelLg1 &&
        !this.state.isIDExisting &&
        !this.state.isLabelExisting
      ) {
        this.setState({
          creation: 'PENDING',
        });
        postCollections(data).then(() => {
          this.props.history.push(
            '/collection/' +
              this.state.idCollection.split(' ').join('').toLowerCase()
          );
        });
      }
    };
  }

  componentWillMount() {
    this.props.loadConceptList();
    this.props.loadStampList();
  }

  render() {
    const { stampList } = this.props;
    const {
      creator,
      members,
      potentialMembers,
      searchLabel,
      isIDExisting,
      isLabelExisting,
      creation,
      idCollection,
      prefLabelLg1,
      contributor,
    } = this.state;
    const flagFr = <img src={fr} alt="fr" className="img-flag" />;
    const flagEn = <img src={en} alt="fr" className="img-flag" />;
    const logoAdd = <img src={add} alt="add" className="img-flag" />;
    const logoDel = <img src={del} alt="delete" className="img-flag" />;

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

    if (
      creation === 'PENDING' &&
      idCollection &&
      prefLabelLg1 &&
      !isIDExisting &&
      !isLabelExisting
    ) {
      return (
        <div>
          <MenuConcepts />
          <Loadable
            active={true}
            spinner
            text={dictionary.loadable.saving}
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
                {dictionary.collection.create}
              </h2>
            </div>
          </div>
          <CollectionCreateControl
            attr={this.state}
            onChangeSave={this.editCollectionData}
            onChangeReturn={this.return}
          />
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
              className="form-control"
              required="required"
              onChange={e => this.handleChangeId(e.target.value)}
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
              defaultValue={contributor}
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

const mapStateToProps = state => ({
  conceptsList: state.conceptsList,
  collectionsList: state.collectionsList,
  stampList: state.stampList,
});

const mapDispatchToProps = {
  loadConceptList,
  loadStampList,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(CollectionCreate)
);
