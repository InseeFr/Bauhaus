import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { Tabs, Tab } from 'react-bootstrap';
import Modal from 'react-modal';
import DOMPurify from 'dompurify';
import SelectRmes from 'js/utils/select-rmes';
import DatePickerRmes from 'js/utils/date-picker-rmes';
import Loadable from 'react-loading-overlay';
import ConceptCreateControl from './concept-create-control';
import ConceptModifyNotes from './concept-modify-notes';
import { EditorState } from 'draft-js';
import {
  editorLength,
  editorLengthText,
} from 'js/components/shared/editor-html';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import MenuConcepts from '../menu-concepts';
import ConceptToLink from './concept-to-link';
import { loadStampsList } from 'js/actions/stamps';
import { loadDisseminationStatusList } from 'js/actions/dissemination-status';
import {
  loadConceptGeneralAndNotes,
  loadConceptLinks,
} from 'js/actions/concept-by-id';
import { dictionary } from 'js/utils/dictionary';
import { maxLengthScopeNote } from 'config/config';
import { postModifiedConcepts } from 'js/utils/remote-api';
import {
  sortArray,
  filterByPrefLabelFr,
  arrayKeepUniqueField,
  getMembers,
  getPotentialMembers,
} from 'js/utils/array-utils';
import { objectSize, isEmpty, isChanged } from 'js/utils/utils';

//components
import PageTitle from 'js/components/shared/page-title';
import fr from 'img/fr.png';
import en from 'img/en.png';
import add from 'img/add.png';
import del from 'img/del.png';
import warning from 'img/warning.jpg';
import buildExtract from 'js/utils/build-extract';

const extractId = buildExtract('id');

const sortByLabel = sortArray('prefLabelFr');

class ConceptModify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      creation: 'WAITING',
      prefLabelFr: '',
      isLabelFrExisting: false,
      prefLabelEn: '',
      altLabelFr: '',
      altLabelEn: '',
      creator: '',
      contributor: '',
      disseminationStatus: '',
      additionnalMaterial: '',
      dateEnd: '',
      searchLabel: '',
      memberParent: [],
      memberEnfants: [],
      memberRef: [],
      memberSucceed: [],
      memberLink: [],
      potentialMembers: [],
      activeTabLink: 1,
      definitionCourteFr: EditorState.createEmpty(),
      isDefinitionCourteFr: EditorState.createEmpty()
        .getCurrentContent()
        .hasText(),
      isDefinitionCourteFrChanged: false,
      definitionCourteEn: EditorState.createEmpty(),
      isDefinitionCourteEn: EditorState.createEmpty()
        .getCurrentContent()
        .hasText(),
      isDefinitionCourteEnChanged: false,
      definitionFr: EditorState.createEmpty(),
      isDefinitionFr: EditorState.createEmpty().getCurrentContent().hasText(),
      isDefinitionFrChanged: false,
      definitionEn: EditorState.createEmpty(),
      isDefinitionEn: EditorState.createEmpty().getCurrentContent().hasText(),
      isDefinitionEnChanged: false,
      noteEditorialeFr: EditorState.createEmpty(),
      isNoteEditorialeFr: EditorState.createEmpty()
        .getCurrentContent()
        .hasText(),
      isNoteEditorialeFrChanged: false,
      noteEditorialeEn: EditorState.createEmpty(),
      isNoteEditorialeEn: EditorState.createEmpty()
        .getCurrentContent()
        .hasText(),
      isNoteEditorialeEnChanged: false,
      changeNoteFr: EditorState.createEmpty(),
      isChangeNoteFr: EditorState.createEmpty().getCurrentContent().hasText(),
      isChangeNoteFrChanged: false,
      changeNoteEn: EditorState.createEmpty(),
      isChangeNoteEn: EditorState.createEmpty().getCurrentContent().hasText(),
      isChangeNoteEnChanged: false,
    };

    // ConceptGeneral
    this.handleChangePrefLabelFr = prefLabelFr => {
      this.setState({ prefLabelFr });
      this.setState({
        isLabelFrExisting:
          arrayKeepUniqueField(this.props.conceptsList, 'prefLabelFr').indexOf(
            _.deburr(prefLabelFr.toLowerCase())
          ) !== -1 && prefLabelFr !== this.props.conceptGeneral.prefLabelFr,
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
    this.handleChangeDateEnd = (value, formattedValue) => {
      this.setState({
        value,
        formattedValue,
        dateEnd: value,
      });
    };

    //ConceptLinks
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

    //ConceptNotes
    this.changeDefinitionCourteFr = definitionCourteFr => {
      this.setState({
        definitionCourteFr,
        isDefinitionCourteFr: definitionCourteFr.getCurrentContent().hasText(),
        isDefinitionCourteFrChanged: isChanged(
          this.props.conceptNotes.definitionCourteFr,
          stateToHTML(definitionCourteFr.getCurrentContent())
        ),
      });
    };
    this.changeDefinitionCourteEn = definitionCourteEn => {
      this.setState({
        definitionCourteEn,
        isDefinitionCourteEn: definitionCourteEn.getCurrentContent().hasText(),
        isDefinitionCourteEnChanged: isChanged(
          this.props.conceptNotes.definitionCourteEn,
          stateToHTML(definitionCourteEn.getCurrentContent())
        ),
      });
    };
    this.changeDefinitionFr = definitionFr => {
      this.setState({
        definitionFr,
        isDefinitionFr: definitionFr.getCurrentContent().hasText(),
        isDefinitionFrChanged: isChanged(
          this.props.conceptNotes.definitionFr,
          stateToHTML(definitionFr.getCurrentContent())
        ),
      });
    };
    this.changeDefinitionEn = definitionEn => {
      this.setState({
        definitionEn,
        isDefinitionEn: definitionEn.getCurrentContent().hasText(),
        isDefinitionEnChanged: isChanged(
          this.props.conceptNotes.definitionEn,
          stateToHTML(definitionEn.getCurrentContent())
        ),
      });
    };
    this.changeNoteEditorialeFr = noteEditorialeFr => {
      this.setState({
        noteEditorialeFr,
        isNoteEditorialeFr: noteEditorialeFr.getCurrentContent().hasText(),
        isNoteEditorialeFrChanged: isChanged(
          this.props.conceptNotes.noteEditorialeFr,
          stateToHTML(noteEditorialeFr.getCurrentContent())
        ),
      });
    };
    this.changeNoteEditorialeEn = noteEditorialeEn => {
      this.setState({
        noteEditorialeEn,
        isNoteEditorialeEn: noteEditorialeEn.getCurrentContent().hasText(),
        isNoteEditorialeEnChanged: isChanged(
          this.props.conceptNotes.noteEditorialeEn,
          stateToHTML(noteEditorialeEn.getCurrentContent())
        ),
      });
    };
    this.changeChangeNoteFr = changeNoteFr => {
      this.setState({
        changeNoteFr,
        isChangeNoteFr: changeNoteFr.getCurrentContent().hasText(),
        isChangeNoteFrChanged: isChanged(
          this.props.conceptNotes.changeNoteFr,
          stateToHTML(changeNoteFr.getCurrentContent())
        ),
      });
    };
    this.changeChangeNoteEn = changeNoteEn => {
      this.setState({
        changeNoteEn,
        isChangeNoteEn: changeNoteEn.getCurrentContent().hasText(),
        isChangeNoteEnChanged: isChanged(
          this.props.conceptNotes.changeNoteEn,
          stateToHTML(changeNoteEn.getCurrentContent())
        ),
      });
    };
    this.return = () => {
      this.props.history.push('/concept/' + this.props.conceptGeneral.id);
    };

    // Save
    this.open = () => {
      this.setState({ showModal: true });
    };

    this.close = () => {
      this.setState({ showModal: false });
    };
    this.askToConfirm = () => {
      if (
        this.props.conceptGeneral.isValidated ===
          dictionary.status.concept.valid &&
        (this.state.isDefinitionCourteFrChanged ||
          this.state.isDefinitionFrChanged ||
          this.state.isNoteEditorialeFrChanged) &&
        objectSize(this.props.conceptNotes) > 1
      ) {
        this.open();
      } else {
        this.editConceptData(false);
      }
    };
    this.closeAndMinor = () => {
      this.setState({
        showModal: false,
      });
      this.editConceptData(false);
    };
    this.closeAndMajor = () => {
      this.setState({
        showModal: false,
      });
      this.editConceptData(true);
    };
    this.editConceptData = wantToVersionning => {
      const data = {
        wantToVersionning,
        isValidated: this.props.conceptGeneral.isValidated,
        conceptVersion: this.props.conceptGeneral.conceptVersion,
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
        created: this.props.conceptGeneral.created,
        dateEnd: this.state.dateEnd,
        memberParent: this.state.memberParent,
        memberEnfants: this.state.memberEnfants,
        memberRef: this.state.memberRef,
        memberSucceed: this.state.memberSucceed,
        memberLink: this.state.memberLink,
        isDefinitionCourteFrChanged: this.state.isDefinitionCourteFrChanged,
        isDefinitionCourteEnChanged: this.state.isDefinitionCourteEnChanged,
        isDefinitionCourteFr: this.state.isDefinitionCourteFr,
        isDefinitionCourteEn: this.state.isDefinitionCourteEn,
        definitionCourteFrVersion: this.props.conceptNotes
          .definitionCourteFrVersion,
        definitionCourteFr: stateToHTML(
          this.state.definitionCourteFr.getCurrentContent()
        ),
        definitionCourteEnVersion: this.props.conceptNotes
          .definitionCourteEnVersion,
        definitionCourteEn: stateToHTML(
          this.state.definitionCourteEn.getCurrentContent()
        ),
        isDefinitionFrChanged: this.state.isDefinitionFrChanged,
        isDefinitionEnChanged: this.state.isDefinitionEnChanged,
        isDefinitionFr: this.state.isDefinitionFr,
        isDefinitionEn: this.state.isDefinitionEn,
        definitionFrVersion: this.props.conceptNotes.definitionFrVersion,
        definitionFr: stateToHTML(this.state.definitionFr.getCurrentContent()),
        definitionEnVersion: this.props.conceptNotes.definitionEnVersion,
        definitionEn: stateToHTML(this.state.definitionEn.getCurrentContent()),
        isNoteEditorialeFrChanged: this.state.isNoteEditorialeFrChanged,
        isNoteEditorialeEnChanged: this.state.isNoteEditorialeEnChanged,
        isNoteEditorialeFr: this.state.isNoteEditorialeFr,
        isNoteEditorialeEn: this.state.isNoteEditorialeEn,
        noteEditorialeFrVersion: this.props.conceptNotes
          .noteEditorialeFrVersion,
        noteEditorialeFr: stateToHTML(
          this.state.noteEditorialeFr.getCurrentContent()
        ),
        noteEditorialeEnVersion: this.props.conceptNotes
          .noteEditorialeEnVersion,
        noteEditorialeEn: stateToHTML(
          this.state.noteEditorialeEn.getCurrentContent()
        ),
        isChangeNoteFrChanged: this.state.isChangeNoteFrChanged,
        isChangeNoteEnChanged: this.state.isChangeNoteEnChanged,
        isChangeNoteFr: this.state.isChangeNoteFr,
        isChangeNoteEn: this.state.isChangeNoteEn,
        changeNoteFr: stateToHTML(this.state.changeNoteFr.getCurrentContent()),
        changeNoteEn: stateToHTML(this.state.changeNoteEn.getCurrentContent()),
      };
      this.setState({
        creation: 'PENDING',
      });
      postModifiedConcepts(this.props.conceptGeneral.id, data)
        .then(() => {
          this.props.loadConceptGeneralAndNotes(extractId(this.props));
        })
        .then(() => {
          this.props.history.push('/concept/' + this.props.conceptGeneral.id);
        });
    };
  }

  componentWillMount() {
    this.props.loadStampsList();
    this.props.loadDisseminationStatusList();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      prefLabelFr: nextProps.conceptGeneral.prefLabelFr,
      prefLabelEn: nextProps.conceptGeneral.prefLabelEn,
      altLabelFr: nextProps.conceptGeneral.altLabelFr,
      altLabelEn: nextProps.conceptGeneral.altLabelEn,
      creator: nextProps.conceptGeneral.creator,
      contributor: nextProps.conceptGeneral.contributor,
      disseminationStatus: nextProps.conceptGeneral.disseminationStatus,
      additionnalMaterial: nextProps.conceptGeneral.additionnalMaterial,
      dateEnd: nextProps.conceptGeneral.dateEnd,
      memberParent: getMembers(nextProps.conceptLinks, 'memberParent'),
      memberEnfants: getMembers(nextProps.conceptLinks, 'memberEnfants'),
      memberRef: getMembers(nextProps.conceptLinks, 'memberRef'),
      memberSucceed: getMembers(nextProps.conceptLinks, 'memberSucceed'),
      memberLink: getMembers(nextProps.conceptLinks, 'memberLink'),
      potentialMembers: getPotentialMembers(
        nextProps.conceptsList,
        nextProps.conceptLinks,
        nextProps.conceptGeneral.id
      ),
      isDefinitionCourteFr: !isEmpty(nextProps.conceptNotes.definitionCourteFr),
      definitionCourteFr: EditorState.createWithContent(
        stateFromHTML(nextProps.conceptNotes.definitionCourteFr)
      ),
      isDefinitionCourteEn: !isEmpty(nextProps.conceptNotes.definitionCourteEn),
      definitionCourteEn: EditorState.createWithContent(
        stateFromHTML(nextProps.conceptNotes.definitionCourteEn)
      ),
      isDefinitionFr: !isEmpty(nextProps.conceptNotes.definitionFr),
      definitionFr: EditorState.createWithContent(
        stateFromHTML(nextProps.conceptNotes.definitionFr)
      ),
      isDefinitionEn: !isEmpty(nextProps.conceptNotes.definitionEn),
      definitionEn: EditorState.createWithContent(
        stateFromHTML(nextProps.conceptNotes.definitionEn)
      ),
      isNoteEditorialeFr: !isEmpty(nextProps.conceptNotes.noteEditorialeFr),
      noteEditorialeFr: EditorState.createWithContent(
        stateFromHTML(nextProps.conceptNotes.noteEditorialeFr)
      ),
      isNoteEditorialeEn: !isEmpty(nextProps.conceptNotes.noteEditorialeEn),
      noteEditorialeEn: EditorState.createWithContent(
        stateFromHTML(nextProps.conceptNotes.noteEditorialeEn)
      ),
      isChangeNoteFr: !isEmpty(nextProps.conceptNotes.changeNoteFr),
      changeNoteFr: EditorState.createWithContent(
        stateFromHTML(nextProps.conceptNotes.changeNoteFr)
      ),
      isChangeNoteEn: !isEmpty(nextProps.conceptNotes.changeNoteEn),
      changeNoteEn: EditorState.createWithContent(
        stateFromHTML(nextProps.conceptNotes.changeNoteEn)
      ),
    });
  }

  render() {
    const { conceptGeneral, stampsList, disseminationStatusList } = this.props;
    const {
      creation,
      searchLabel,
      potentialMembers,
      dateEnd,
      creator,
      disseminationStatus,
      memberParent,
      memberEnfants,
      memberRef,
      memberSucceed,
      memberLink,
      definitionCourteFr,
      definitionCourteEn,
      definitionFr,
      definitionEn,
      isDefinitionCourteFr,
      isDefinitionFr,
      isChangeNoteFr,
      isChangeNoteFrChanged,
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
        onClick={e => this.OnClickAddMember(item)}>
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
        onClick={e => this.OnClickDelMemberParent(item)}>
        {logoDel} {item.prefLabelFr}
      </li>
    );
    const memberEnfantsList = sortByLabel(memberEnfants).map(item =>
      <li
        key={item.id}
        className="list-group-item"
        onClick={e => this.OnClickDelMemberEnfants(item)}>
        {logoDel} {item.prefLabelFr}
      </li>
    );
    const memberRefList = sortByLabel(memberRef).map(item =>
      <li
        key={item.id}
        className="list-group-item"
        onClick={e => this.OnClickDelMemberRef(item)}>
        {logoDel} {item.prefLabelFr}
      </li>
    );
    const memberSucceedList = sortByLabel(memberSucceed).map(item =>
      <li
        key={item.id}
        className="list-group-item"
        onClick={e => this.OnClickDelMemberSucceed(item)}>
        {logoDel} {item.prefLabelFr}
      </li>
    );
    const memberLinkList = sortByLabel(memberLink).map(item =>
      <li
        key={item.id}
        className="list-group-item"
        onClick={e => this.OnClickDelMemberLink(item)}>
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

    const versionningIsPossible =
      isChangeNoteFr && isChangeNoteFrChanged ? true : false;
    const disabledVersionningButton = !versionningIsPossible;

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

    if (!stampsList) return null;

    return (
      <div>
        <MenuConcepts />
        <div className="container">
          <PageTitle
            title={dictionary.concept.modify}
            subTitle={conceptGeneral.prefLabelFr}
          />
          {this.state.contributor &&
            <ConceptCreateControl
              attr={this.state}
              onChangeSave={this.askToConfirm}
              onChangeReturn={this.return}
            />}
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
                      defaultValue={conceptGeneral.prefLabelFr}
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
                      defaultValue={conceptGeneral.prefLabelEn}
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
                      defaultValue={conceptGeneral.altLabelFr}
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
                      defaultValue={conceptGeneral.altLabelEn}
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
                    defaultValue={conceptGeneral.contributor}
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
                      defaultValue={
                        conceptGeneral.additionnalMaterial
                          ? conceptGeneral.additionnalMaterial.replace(
                              'http://',
                              ''
                            )
                          : ''
                      }
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
                    onSelect={this.handleSelectTab}>
                    <Tab
                      eventKey={1}
                      title={scopeNoteTabLabel}
                      style={{ marginTop: '20px' }}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group centered">
                            <label>
                              {flagFr}
                            </label>
                            <ConceptModifyNotes
                              note={definitionCourteFr}
                              onChange={e => this.changeDefinitionCourteFr(e)}
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
                            <ConceptModifyNotes
                              note={definitionCourteEn}
                              onChange={e => this.changeDefinitionCourteEn(e)}
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
                      style={{ marginTop: '20px' }}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group centered">
                            <label>
                              {flagFr}
                            </label>
                            <ConceptModifyNotes
                              note={definitionFr}
                              onChange={e => this.changeDefinitionFr(e)}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group centered">
                            <label>
                              {flagEn}
                            </label>
                            <ConceptModifyNotes
                              note={definitionEn}
                              onChange={e => this.changeDefinitionEn(e)}
                            />
                          </div>
                        </div>
                      </div>
                    </Tab>
                    <Tab
                      eventKey={3}
                      title={dictionary.notes.editorialeNote}
                      style={{ marginTop: '20px' }}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group centered">
                            <label>
                              {flagFr}
                            </label>
                            <ConceptModifyNotes
                              note={noteEditorialeFr}
                              onChange={e => this.changeNoteEditorialeFr(e)}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group centered">
                            <label>
                              {flagEn}
                            </label>
                            <ConceptModifyNotes
                              note={noteEditorialeEn}
                              onChange={e => this.changeNoteEditorialeEn(e)}
                            />
                          </div>
                        </div>
                      </div>
                    </Tab>
                    <Tab
                      eventKey={4}
                      title={dictionary.notes.changeNote}
                      style={{ marginTop: '20px' }}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group centered">
                            <label>
                              {flagFr}
                            </label>
                            <ConceptModifyNotes
                              note={changeNoteFr}
                              onChange={e => this.changeChangeNoteFr(e)}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group centered">
                            <label>
                              {flagEn}
                            </label>
                            <ConceptModifyNotes
                              note={changeNoteEn}
                              onChange={e => this.changeChangeNoteEn(e)}
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
                    onSelect={this.handleSelectTab}>
                    <Tab
                      eventKey={1}
                      title={dictionary.links.narrower}
                      style={{ marginTop: '20px' }}>
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
                      style={{ marginTop: '20px' }}>
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
                      style={{ marginTop: '20px' }}>
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
                      style={{ marginTop: '20px' }}>
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
                      style={{ marginTop: '20px' }}>
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
        <div>
          <Modal
            className="Modal__Bootstrap modal-dialog"
            isOpen={this.state.showModal}
            onRequestClose={this.close}>
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" onClick={this.close}>
                  <span aria-hidden="true">&times;</span>
                  <span className="sr-only">
                    {dictionary.buttons.close}
                  </span>
                </button>
                <h4 className="modal-title">
                  {dictionary.concept.versionning.title}
                </h4>
              </div>
              <div className="modal-body">
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      dictionary.concept.versionning.body([
                        conceptGeneral.prefLabelFr,
                      ])
                    ),
                  }}
                />
              </div>
              <div className="modal-footer">
                <div className="centered">
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={this.closeAndMinor}>
                    {dictionary.buttons.minorVersion}
                  </button>
                  <button
                    type="button"
                    className="btn btn-default btn-lg"
                    onClick={this.close}>
                    {dictionary.buttons.cancel}
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={this.closeAndMajor}
                    disabled={disabledVersionningButton}>
                    {dictionary.buttons.majorVersion}
                  </button>
                </div>
                {!versionningIsPossible &&
                  <div
                    style={{ 'text-align': 'left', marginTop: '20px' }}
                    className="red"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        dictionary.concept.versionning.footer
                      ),
                    }}
                  />}
              </div>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const id = extractId(ownProps);
  return {
    conceptGeneral: state.conceptGeneral[id],
    conceptNotes:
      state.conceptNotes[id][state.conceptGeneral[id].conceptVersion],
    conceptLinks: state.conceptLinks[id],
    stampsList: state.stampsList,
    disseminationStatusList: state.disseminationStatusList,
    conceptsList: state.conceptsList,
  };
};

const mapDispatchToProps = {
  loadStampsList,
  loadDisseminationStatusList,
  loadConceptGeneralAndNotes,
  loadConceptLinks,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(ConceptModify)
);
