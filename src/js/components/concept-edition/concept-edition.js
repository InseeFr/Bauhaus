import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'react-bootstrap';
import Loadable from 'react-loading-overlay';
import ConceptCreateControl from './concept-create-control';
import MenuConcepts from '../menu-concepts';
import GeneralEdition from './concept-general-edition';
import NotesEdition from './notes-edition';
import LinksEdition from './links-edition';
import Confirm from './confirm-modal';
import { withRouter } from 'react-router-dom';

import { propTypes as generalPropTypes } from 'js/utils/concepts/general';
import {
  propTypes as notePropTypes,
  areNotesChanged,
} from 'js/utils/concepts/notes';
import { propTypes as conceptsWithLinksPropTypes } from 'js/utils/concepts/links';
import { dictionary } from 'js/utils/dictionary';
import isVersioningPossible from 'js/utils/concepts/is-versioning-possible';

import { VERSIONING, NO_VERSIONING } from 'js/constants';

class ConceptEdition extends Component {
  constructor(props) {
    super(props);
    const { general, notes, conceptsWithLinks } = props;
    this.state = {
      showModal: false,
      creation: 'WAITING',
      data: {
        general,
        notes,
        conceptsWithLinks,
      },
    };

    //update should look like `{ prefLabelEn: 'something new' }` (we can
    //set mutliple properties at the same time)
    this.handleChangeGeneral = update => {
      const data = this.state.data;
      const general = data.general;
      const newData = Object.assign(data, {
        general: Object.assign(general, update),
      });
      this.setState({
        data: newData,
      });
    };

    //update should look like `{ noteEditorialeFr: '...' }`
    this.handleChangeNotes = update => {
      const data = this.state.data;
      const notes = data.notes;
      const newData = Object.assign(data, {
        notes: Object.assign(notes, update),
      });
      this.setState({
        data: newData,
      });
    };

    //`newLinks` looks like
    //`[{ id: '...',  label: '...', typeOfLink: '...' }, { ... }, { ... }]
    //This new array has the same length as the initial `conceptsWithLinks`
    //array, `typeOfLink` is the only property updated. It can switch from:
    // - something (PARENT, CHILD...) to NONE if it has been removed
    // - NONE to something (PARENT, CHILD...) if it has been added.
    //It should not be switched directle from something to something else since
    //the UI does not expose this scenario (we can only remove or add).
    this.handleChangeLinks = newLinks =>
      this.setState({
        data: {
          ...this.state.data,
          conceptsWithLinks: newLinks,
        },
      });

    //TODO does not work for creation (no id available)
    this.goBackToConceptPage = id => {
      //TODO use <Navigate />
      this.props.history.push(`/concept/${id}`);
    };

    //TODO does not work for edition (value id)
    this.handleCancel = () => {
      //TODO use <Navigate />
      //this.props.history.push(`/concept/${this.props.id}`);
      this.props.history.push(`/concept`);
    };

    this.askToConfirm = () => {
      //TODO check against a constant instead
      const isValidated =
        this.general.isValidated === dictionary.status.concept.valid;
      if (isValidated) {
        if (this.areNotesChanged()) return this.save(NO_VERSIONING);
      }
      this.openModal();
    };

    this.openModal = () => {
      this.setState({ showModal: true });
    };

    this.saveConcept = versionType => {
      return this.props.save(
        versionType,
        this.getOriginalData(),
        this.state.data
      );
    };

    this.closeModal = submitVersioningType => {
      this.setState({ showModal: false });
      if (submitVersioningType) {
        this.setState({ creation: 'PENDING' });
        this.saveConcept().then(this.goBackToConceptPage);
      }
    };

    this.getOriginalData = () => ({
      general: this.props.general,
      notes: this.props.notes,
      conceptsWithLinks: this.props.conceptsWithLinks,
    });

    this.isVersioningPossible = () =>
      isVersioningPossible(this.props.notes, this.state.data.notes);

    this.areNotesChanged = () => {
      const oldNotes = this.getOriginalData().notes;
      const newNotes = this.state.data.notes;
      return areNotesChanged(oldNotes, newNotes);
    };
  }

  render() {
    const { stampsList, disseminationStatusList, pageTitle } = this.props;
    const {
      showModal,
      creation,
      data: { general, notes, conceptsWithLinks },
    } = this.state;
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
          {pageTitle}
          {this.props.general.contributor &&
            <ConceptCreateControl
              oldGeneral={this.getOriginalData().general}
              general={general}
              notes={notes}
              conceptsWithLinks={conceptsWithLinks}
              handleSave={this.askToConfirm}
              handleCancel={this.handleCancel}
            />}
          <ul className="nav nav-tabs nav-justified">
            <Tabs defaultActiveKey={0} id="informationToManage">
              <Tab eventKey={0} title={dictionary.concept.general}>
                <GeneralEdition
                  general={general}
                  handleChange={this.handleChangeGeneral}
                  stampsList={stampsList}
                  disseminationStatusList={disseminationStatusList}
                />
              </Tab>
              <Tab eventKey={1} title={dictionary.notes.title}>
                <NotesEdition
                  notes={notes}
                  handleChange={this.handleChangeNotes}
                />
              </Tab>
              <Tab eventKey={2} title={dictionary.links.title}>
                <LinksEdition
                  conceptsWithLinks={conceptsWithLinks}
                  handleChange={this.handleChangeLinks}
                />
              </Tab>
            </Tabs>
          </ul>
        </div>
        <div>
          <Confirm
            isOpen={showModal}
            label={''}
            versioningIsPossible={this.isVersioningPossible()}
            closeCancel={() => this.close()}
            closeMinor={() => this.close(NO_VERSIONING)}
            closeMajor={() => this.close(VERSIONING)}
          />
        </div>
      </div>
    );
  }
}

ConceptEdition.propTypes = {
  id: PropTypes.string, // not available for creation
  pageTitle: PropTypes.element.isRequired,
  general: generalPropTypes.isRequired,
  notes: notePropTypes.isRequired,
  conceptsWithLinks: conceptsWithLinksPropTypes.isRequired,
  stampsList: PropTypes.array.isRequired,
  disseminationStatusList: PropTypes.array.isRequired,
  save: PropTypes.func.isRequired,
};

//TODO remove `withRouter` -> <Navigate />
export default withRouter(ConceptEdition);
