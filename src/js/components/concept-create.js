import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { Tabs, Tab } from 'react-bootstrap';
import SelectRmes from '../utils/select-rmes';
import DatePickerRmes from '../utils/date-picker-rmes';
import Loadable from 'react-loading-overlay';
import MenuConcepts from './menu-concepts';
import EditorHtml, { editorLength, editorLengthText } from './editor-html';
import { EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import ConceptToLink from './concept-to-link';
import ConceptCreateControl from './concept-create-control';
import { loadStampsList } from '../actions/stamps';
import { loadDisseminationStatusList } from '../actions/dissemination-status';
import { dictionary } from '../utils/dictionary';
import { defaultContributor, maxLengthScopeNote } from '../../config/config';
import { postConcepts } from '../utils/remote-api';
import {
  sortArray,
  filterByPrefLabelFr,
  arrayKeepUniqueField,
} from '../utils/array-utils';
import fr from '../../img/fr.png';
import en from '../../img/en.png';
import add from '../../img/add.png';
import del from '../../img/del.png';
import warning from '../../img/warning.jpg';
import '../../css/app.css';

const sortByLabel = sortArray('prefLabelFr');

class ConceptCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prefLabelFr: '',
      isLabelFrExisting: false,
      prefLabelEn: '',
      altLabelFr: '',
      altLabelEn: '',
      creator: '',
      contributor: defaultContributor,
      disseminationStatus: '',
      additionnalMaterial: '',
      dateEnd: null,
      searchLabel: '',
      memberParent: [],
      memberEnfants: [],
      memberRef: [],
      memberSucceed: [],
      memberLink: [],
      potentialMembers: this.props.conceptsList,
      activeTabLink: 1,
      creation: 'EDITION',
      definitionCourteFr: EditorState.createEmpty(),
      isDefinitionCourteFr: EditorState.createEmpty()
        .getCurrentContent()
        .hasText(),
      definitionCourteEn: EditorState.createEmpty(),
      isDefinitionCourteEn: EditorState.createEmpty()
        .getCurrentContent()
        .hasText(),
      definitionFr: EditorState.createEmpty(),
      isDefinitionFr: EditorState.createEmpty().getCurrentContent().hasText(),
      definitionEn: EditorState.createEmpty(),
      isDefinitionEn: EditorState.createEmpty().getCurrentContent().hasText(),
      noteEditorialeFr: EditorState.createEmpty(),
      isNoteEditorialeFr: EditorState.createEmpty()
        .getCurrentContent()
        .hasText(),
      noteEditorialeEn: EditorState.createEmpty(),
      isNoteEditorialeEn: EditorState.createEmpty()
        .getCurrentContent()
        .hasText(),
      changeNoteFr: EditorState.createEmpty(),
      isChangeNoteFr: EditorState.createEmpty().getCurrentContent().hasText(),
      changeNoteEn: EditorState.createEmpty(),
      isChangeNoteEn: EditorState.createEmpty().getCurrentContent().hasText(),
    };
    this.handleChangePrefLabelFr = prefLabelFr => {
      this.setState({ prefLabelFr });
      if (
        arrayKeepUniqueField(this.props.conceptsList, 'prefLabelFr').indexOf(
          _.deburr(prefLabelFr.toLowerCase())
        ) !== -1
      )
        this.setState({
          isLabelFrExisting: true,
        });
      else
        this.setState({
          isLabelFrExisting: false,
        });
    };
    this.handleChangePrefLabelEn = prefLabelEn => {
      this.setState({ prefLabelEn });
    };
    this.handleChangeAltLabelFr = altLabelFr => {
      this.setState({ altLabelFr });
    };
    this.handleChangeAltLabelEn = altLabelEn => {
      this.setState({ altLabelEn });
    };
    this.changeSelectCreator = e => {
      this.setState({
        creator: e ? e.value : '',
      });
    };
    this.changeSelectDisseminationStatus = e => {
      this.setState({
        disseminationStatus: e ? e.value : '',
      });
    };
    this.handleChangeAdditionnalMaterial = additionnalMaterial => {
      this.setState({ additionnalMaterial });
    };
    this.handleChangeDateEnd = dateEnd => {
      this.setState({
        dateEnd,
      });
    };

    this.handleChangeSearch = searchLabel => {
      this.setState({ searchLabel });
    };

    this.handleSelectTab = e => {
      this.setState({
        activeTabLink: e,
      });
    };

    this.OnClickAddMember = e => {
      this.setState({
        potentialMembers: _.pull(this.state.potentialMembers, e),
      });
      if (this.state.activeTabLink === 1) {
        this.setState({
          memberParent: [...this.state.memberParent, e],
        });
      }
      if (this.state.activeTabLink === 2) {
        this.setState({
          memberEnfants: [...this.state.memberEnfants, e],
        });
      }
      if (this.state.activeTabLink === 3) {
        this.setState({
          memberRef: [...this.state.memberRef, e],
        });
      }
      if (this.state.activeTabLink === 4) {
        this.setState({
          memberSucceed: [...this.state.memberSucceed, e],
        });
      }
      if (this.state.activeTabLink === 5) {
        this.setState({
          memberLink: [...this.state.memberLink, e],
        });
      }
    };

    this.OnClickDelMemberParent = e => {
      this.setState({
        memberParent: _.pull(this.state.memberParent, e),
        potentialMembers: [...this.state.potentialMembers, e],
      });
    };
    this.OnClickDelMemberEnfants = e => {
      this.setState({
        memberEnfants: _.pull(this.state.memberEnfants, e),
        potentialMembers: [...this.state.potentialMembers, e],
      });
    };
    this.OnClickDelMemberRef = e => {
      this.setState({
        memberRef: _.pull(this.state.memberRef, e),
        potentialMembers: [...this.state.potentialMembers, e],
      });
    };
    this.OnClickDelMemberSucceed = e => {
      this.setState({
        memberSucceed: _.pull(this.state.memberSucceed, e),
        potentialMembers: [...this.state.potentialMembers, e],
      });
    };
    this.OnClickDelMemberLink = e => {
      this.setState({
        memberLink: _.pull(this.state.memberLink, e),
        potentialMembers: [...this.state.potentialMembers, e],
      });
    };

    this.changeDefinitionCourteFr = definitionCourteFr => {
      this.setState({
        definitionCourteFr,
        isDefinitionCourteFr: definitionCourteFr.getCurrentContent().hasText(),
      });
    };
    this.changeDefinitionCourteEn = definitionCourteEn => {
      this.setState({
        definitionCourteEn,
        isDefinitionCourteEn: definitionCourteEn.getCurrentContent().hasText(),
      });
    };
    this.changeDefinitionFr = definitionFr => {
      this.setState({
        definitionFr,
        isDefinitionFr: definitionFr.getCurrentContent().hasText(),
      });
    };
    this.changeDefinitionEn = definitionEn => {
      this.setState({
        definitionEn,
        isDefinitionEn: definitionEn.getCurrentContent().hasText(),
      });
    };
    this.changeNoteEditorialeFr = noteEditorialeFr => {
      this.setState({
        noteEditorialeFr,
        isNoteEditorialeFr: noteEditorialeFr.getCurrentContent().hasText(),
      });
    };
    this.changeNoteEditorialeEn = noteEditorialeEn => {
      this.setState({
        noteEditorialeEn,
        isNoteEditorialeEn: noteEditorialeEn.getCurrentContent().hasText(),
      });
    };
    this.changeChangeNoteFr = changeNoteFr => {
      this.setState({
        changeNoteFr,
        isChangeNoteFr: changeNoteFr.getCurrentContent().hasText(),
      });
    };
    this.changeChangeNoteEn = changeNoteEn => {
      this.setState({
        changeNoteEn,
        isChangeNoteEn: changeNoteEn.getCurrentContent().hasText(),
      });
    };
    this.return = () => {
      this.props.history.push('/concepts');
    };
    this.editConceptData = () => {
      const data = {
        prefLabelFr: this.state.prefLabelFr,
        prefLabelEn: this.state.prefLabelEn,
        altLabelFr: this.state.altLabelFr,
        altLabelEn: this.state.altLabelEn,
        creator: this.state.creator,
        contributor: this.state.contributor,
        disseminationStatus: this.state.disseminationStatus,
        additionnalMaterial: this.state.additionnalMaterial
          ? 'http://' + this.state.additionnalMaterial.replace('http://', '')
          : '',
        dateEnd: this.state.dateEnd,
        memberParent: this.state.memberParent,
        memberEnfants: this.state.memberEnfants,
        memberRef: this.state.memberRef,
        memberSucceed: this.state.memberSucceed,
        memberLink: this.state.memberLink,
        isDefinitionCourteFr: this.state.isDefinitionCourteFr,
        isDefinitionCourteEn: this.state.isDefinitionCourteEn,
        definitionCourteFr: stateToHTML(
          this.state.definitionCourteFr.getCurrentContent()
        ),
        definitionCourteEn: stateToHTML(
          this.state.definitionCourteEn.getCurrentContent()
        ),
        isDefinitionFr: this.state.isDefinitionFr,
        isDefinitionEn: this.state.isDefinitionEn,
        definitionFr: stateToHTML(this.state.definitionFr.getCurrentContent()),
        definitionEn: stateToHTML(this.state.definitionEn.getCurrentContent()),
        isNoteEditorialeFr: this.state.isNoteEditorialeFr,
        isNoteEditorialeEn: this.state.isNoteEditorialeEn,
        noteEditorialeFr: stateToHTML(
          this.state.noteEditorialeFr.getCurrentContent()
        ),
        noteEditorialeEn: stateToHTML(
          this.state.noteEditorialeEn.getCurrentContent()
        ),
        isChangeNoteFr: this.state.isChangeNoteFr,
        isChangeNoteEn: this.state.isChangeNoteEn,
        changeNoteFr: stateToHTML(this.state.changeNoteFr.getCurrentContent()),
        changeNoteEn: stateToHTML(this.state.changeNoteEn.getCurrentContent()),
      };
      if (this.state.prefLabelFr && !this.state.isLabelFrExisting) {
        this.setState({
          creation: 'PENDING',
        });
        postConcepts(data)
          .then(newConceptID => newConceptID.text())
          .then(newConceptID => {
            this.props.history.push('/concept/' + newConceptID);
          });
      }
    };
  }

  componentWillMount() {
    this.props.loadStampsList();
    this.props.loadDisseminationStatusList();
  }

  render() {
    const { stampsList, disseminationStatusList } = this.props;
    const {
      contributor,
      creator,
      potentialMembers,
      searchLabel,
      dateEnd,
      disseminationStatus,
      memberParent,
      memberEnfants,
      memberRef,
      memberSucceed,
      memberLink,
      creation,
      definitionCourteFr,
      definitionCourteEn,
      definitionFr,
      definitionEn,
      isDefinitionCourteFr,
      isDefinitionFr,
      noteEditorialeFr,
      noteEditorialeEn,
      changeNoteFr,
      changeNoteEn,
    } = this.state;
    const flagFr = <img src={fr} alt="fr" className="img-flag" />;
    const flagEn = <img src={en} alt="fr" className="img-flag" />;
    const logoAdd = <img src={add} alt="add" className="img-flag" />;
    const logoDel = <img src={del} alt="delete" className="img-flag" />;
    const logoWarning = <img src={warning} alt="warning" className="img" />;

    const potentialMembersList = sortByLabel(
      potentialMembers.filter(filterByPrefLabelFr(_.deburr(searchLabel)))
    ).map(item =>
      <li
        key={item.id}
        className="list-group-item"
        onClick={e => this.OnClickAddMember(item)}
      >
        {logoAdd} {item.prefLabelFr}
      </li>
    );

    const potentialMembersListNoLinks = sortByLabel(
      potentialMembers.filter(filterByPrefLabelFr(_.deburr(searchLabel)))
    ).map(item =>
      <li key={item.id} className="list-group-item">
        {item.prefLabelFr}
      </li>
    );
    const memberParentList = memberParent.map(item =>
      <li
        key={item.id}
        className="list-group-item"
        onClick={e => this.OnClickDelMemberParent(item)}
      >
        {logoDel} {item.prefLabelFr}
      </li>
    );
    const memberEnfantsList = sortByLabel(memberEnfants).map(item =>
      <li
        key={item.id}
        className="list-group-item"
        onClick={e => this.OnClickDelMemberEnfants(item)}
      >
        {logoDel} {item.prefLabelFr}
      </li>
    );
    const memberRefList = sortByLabel(memberRef).map(item =>
      <li
        key={item.id}
        className="list-group-item"
        onClick={e => this.OnClickDelMemberRef(item)}
      >
        {logoDel} {item.prefLabelFr}
      </li>
    );
    const memberSucceedList = sortByLabel(memberSucceed).map(item =>
      <li
        key={item.id}
        className="list-group-item"
        onClick={e => this.OnClickDelMemberSucceed(item)}
      >
        {logoDel} {item.prefLabelFr}
      </li>
    );
    const memberLinkList = sortByLabel(memberLink).map(item =>
      <li
        key={item.id}
        className="list-group-item"
        onClick={e => this.OnClickDelMemberLink(item)}
      >
        {logoDel} {item.prefLabelFr}
      </li>
    );

    const scopeNoteTabLabel =
      !isDefinitionCourteFr && disseminationStatus.includes('Public')
        ? <div className="red">
            {dictionary.notes.scopeNote}
          </div>
        : dictionary.notes.scopeNote;
    const definitionTabLabel = !isDefinitionFr
      ? <div className="red">
          {dictionary.notes.definition}
        </div>
      : dictionary.notes.definition;

    if (creation === 'PENDING') {
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
                {dictionary.concept.create}
              </h2>
            </div>
          </div>
          <ConceptCreateControl
            attr={this.state}
            onChangeSave={this.editConceptData}
            onChangeReturn={this.return}
          />
          <ul className="nav nav-tabs nav-justified">
            <Tabs activeKey={this.state.activeTab} id="tab">
              <Tab eventKey={1} title={dictionary.concept.general}>
                <h4 className="centered">
                  ( <span className="boldRed">*</span> :{' '}
                  {dictionary.requiredFields})
                </h4>
                <div className="row">
                  <div className="form-group col-md-6">
                    <label>
                      {dictionary.concept.label} ( {flagFr} ){' '}
                      <span className="boldRed">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={e =>
                        this.handleChangePrefLabelFr(e.target.value)}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label>
                      {dictionary.concept.label} ( {flagEn} ){' '}
                      <span className="boldWhite">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={e =>
                        this.handleChangePrefLabelEn(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-6">
                    <label>
                      {dictionary.concept.altLabel} ( {flagFr} )
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={e =>
                        this.handleChangeAltLabelFr(e.target.value)}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label>
                      {dictionary.concept.altLabel} ( {flagEn} )
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={e =>
                        this.handleChangeAltLabelEn(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    {dictionary.concept.creator}{' '}
                    <span className="boldRed">*</span>
                  </label>
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
                <div className="form-group">
                  <label>
                    {dictionary.concept.contributor}
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
                    {dictionary.concept.disseminationStatus.title}{' '}
                    <span className="boldRed">*</span>
                  </label>
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
                <div className="form-group">
                  <label>
                    {dictionary.concept.additionnalMaterial}
                  </label>
                  <div className="input-group">
                    <span className="input-group-addon">http://</span>
                    <input
                      type="text"
                      className="form-control"
                      onChange={e =>
                        this.handleChangeAdditionnalMaterial(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    {dictionary.concept.valid}
                  </label>
                  <DatePickerRmes
                    value={dateEnd}
                    onChange={this.handleChangeDateEnd}
                    placement="top"
                  />
                </div>
              </Tab>
              <Tab eventKey={2} title={dictionary.notes.title}>
                <ul className="nav nav-tabs nav-justified">
                  <Tabs
                    defaultActiveKey={1}
                    activeKey={this.state.activeTab}
                    id="tab2"
                    onSelect={this.handleSelectTab}
                  >
                    <Tab
                      eventKey={1}
                      title={scopeNoteTabLabel}
                      style={{ 'margin-top': '20px' }}
                    >
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group centered">
                            <label>
                              {flagFr}
                            </label>
                            <EditorHtml
                              editor={definitionCourteFr}
                              onEditorChange={e =>
                                this.changeDefinitionCourteFr(e)}
                            />
                            <div>
                              {editorLengthText(definitionCourteFr)}
                            </div>
                            <div>
                              {editorLength(definitionCourteFr) >
                                maxLengthScopeNote && logoWarning}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group centered">
                            <label>
                              {flagEn}
                            </label>
                            <EditorHtml
                              editor={definitionCourteEn}
                              onEditorChange={e =>
                                this.changeDefinitionCourteEn(e)}
                            />
                            <div>
                              {editorLengthText(definitionCourteEn)}
                            </div>
                            <div>
                              {editorLength(definitionCourteEn) >
                                maxLengthScopeNote && logoWarning}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row centered boldRed">
                        {maxLengthScopeNote} {dictionary.maxLengthScopeNote}
                      </div>
                    </Tab>
                    <Tab
                      eventKey={2}
                      title={definitionTabLabel}
                      style={{ 'margin-top': '20px' }}
                    >
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group centered">
                            <label>
                              {flagFr}
                            </label>
                            <EditorHtml
                              editor={definitionFr}
                              onEditorChange={e => this.changeDefinitionFr(e)}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group centered">
                            <label>
                              {flagEn}
                            </label>
                            <EditorHtml
                              editor={definitionEn}
                              onEditorChange={e => this.changeDefinitionEn(e)}
                            />
                          </div>
                        </div>
                      </div>
                    </Tab>
                    <Tab
                      eventKey={3}
                      title={dictionary.notes.editorialeNote}
                      style={{ 'margin-top': '20px' }}
                    >
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group centered">
                            <label>
                              {flagFr}
                            </label>
                            <EditorHtml
                              editor={noteEditorialeFr}
                              onEditorChange={e =>
                                this.changeNoteEditorialeFr(e)}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group centered">
                            <label>
                              {flagEn}
                            </label>
                            <EditorHtml
                              editor={noteEditorialeEn}
                              onEditorChange={e =>
                                this.changeNoteEditorialeEn(e)}
                            />
                          </div>
                        </div>
                      </div>
                    </Tab>
                    <Tab
                      eventKey={4}
                      title={dictionary.notes.changeNote}
                      style={{ 'margin-top': '20px' }}
                    >
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group centered">
                            <label>
                              {flagFr}
                            </label>
                            <EditorHtml
                              editor={changeNoteFr}
                              onEditorChange={e => this.changeChangeNoteFr(e)}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group centered">
                            <label>
                              {flagEn}
                            </label>
                            <EditorHtml
                              editor={changeNoteEn}
                              onEditorChange={e => this.changeChangeNoteEn(e)}
                            />
                          </div>
                        </div>
                      </div>
                    </Tab>
                  </Tabs>
                </ul>
              </Tab>
              <Tab eventKey={3} title={dictionary.links.title}>
                <ul className="nav nav-tabs nav-justified">
                  <Tabs
                    defaultActiveKey={1}
                    activeKey={this.state.activeTab}
                    id="tab2"
                    onSelect={this.handleSelectTab}
                  >
                    <Tab
                      eventKey={1}
                      title={dictionary.links.narrower}
                      style={{ 'margin-top': '20px' }}
                    >
                      {memberParentList.length === 0 &&
                        <ConceptToLink
                          panelTitle={dictionary.links.narrower}
                          memberList={memberParentList}
                          potentialMembersList={potentialMembersList}
                          searchLabel={searchLabel}
                          onChange={e =>
                            this.handleChangeSearch(e.target.value)}
                        />}
                      {memberParentList.length === 1 &&
                        <ConceptToLink
                          panelTitle={dictionary.links.narrower}
                          memberList={memberParentList}
                          potentialMembersList={potentialMembersListNoLinks}
                          searchLabel={searchLabel}
                          onChange={e =>
                            this.handleChangeSearch(e.target.value)}
                        />}
                    </Tab>
                    <Tab
                      eventKey={2}
                      title={dictionary.links.broader}
                      style={{ 'margin-top': '20px' }}
                    >
                      <ConceptToLink
                        panelTitle={dictionary.links.broader}
                        memberList={memberEnfantsList}
                        potentialMembersList={potentialMembersList}
                        searchLabel={searchLabel}
                        onChange={e => this.handleChangeSearch(e.target.value)}
                      />
                    </Tab>
                    <Tab
                      eventKey={3}
                      title={dictionary.links.references}
                      style={{ 'margin-top': '20px' }}
                    >
                      <ConceptToLink
                        panelTitle={dictionary.links.references}
                        memberList={memberRefList}
                        potentialMembersList={potentialMembersList}
                        searchLabel={searchLabel}
                        onChange={e => this.handleChangeSearch(e.target.value)}
                      />
                    </Tab>
                    <Tab
                      eventKey={4}
                      title={dictionary.links.replaces}
                      style={{ 'margin-top': '20px' }}
                    >
                      <ConceptToLink
                        panelTitle={dictionary.links.replaces}
                        memberList={memberSucceedList}
                        potentialMembersList={potentialMembersList}
                        searchLabel={searchLabel}
                        onChange={e => this.handleChangeSearch(e.target.value)}
                      />
                    </Tab>
                    <Tab
                      eventKey={5}
                      title={dictionary.links.related}
                      style={{ 'margin-top': '20px' }}
                    >
                      <ConceptToLink
                        panelTitle={dictionary.links.related}
                        memberList={memberLinkList}
                        potentialMembersList={potentialMembersList}
                        searchLabel={searchLabel}
                        onChange={e => this.handleChangeSearch(e.target.value)}
                      />
                    </Tab>
                  </Tabs>
                </ul>
              </Tab>
            </Tabs>
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  conceptsList: state.conceptsList,
  collectionsList: state.collectionsList,
  stampsList: state.stampsList,
  disseminationStatusList: state.disseminationStatusList,
});

const mapDispatchToProps = {
  loadStampsList,
  loadDisseminationStatusList,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(ConceptCreate)
);
