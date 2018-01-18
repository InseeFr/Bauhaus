import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'react-bootstrap';
import ConceptCreateControl from './create-controls';
import GeneralEdition from './general-edition';
import NotesEdition from './notes-edition';
import LinksEdition from './links-edition';
import Confirm from 'js/components/shared/modal/confirm-modal';
import { propTypes as generalPropTypes } from 'js/utils/concepts/general';
import {
	propTypes as notePropTypes,
	areNotesImpactingVersionChanged,
} from 'js/utils/concepts/notes';
import { propTypes as conceptsWithLinksPropTypes } from 'js/utils/concepts/links';
import { dictionary } from 'js/utils/dictionary';
import isVersioningPossible from 'js/utils/concepts/is-versioning-possible';
//TODO reorganize files and exports
//TODO check if we can use a boolean for versioning
import { VERSIONING, NO_VERSIONING } from 'js/constants';

class ConceptEditionCreation extends Component {
	constructor(props) {
		super(props);
		const { general, notes, conceptsWithLinks } = props;
		this.state = {
			id: this.props.id,
			activeTab: 0,
			showModal: false,
			data: {
				general: { ...general },
				notes: { ...notes },
				conceptsWithLinks: [...conceptsWithLinks],
			},
		};

		this.selectTab = tabIndex =>
			this.setState({
				activeTab: tabIndex,
			});
		//update should look like `{ prefLabelLg2: 'something new' }` (we can
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

		//update should look like `{ editorialNoteLg1: '...' }`
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

		this.handleSave = () => {
			if (this.props.creation) {
				this.saveConcept();
			} else {
				//show modal if needed
				this.askToConfirmOrSave();
			}
		};

		this.redirectCancel = () => {
			if (this.props.creation) {
				return `/concepts`;
			} else {
				return `/concept/${this.props.id}`;
			}
		};

		this.askToConfirmOrSave = () => {
			//TODO check against a constant instead==
			const isValidated =
				this.props.general.isValidated === dictionary.status.concept.valid;
			//If notes have changed, we need to open the modal to confirm version
			//change.
			if (isValidated) {
				if (!this.areNotesChanged()) return this.saveConcept(NO_VERSIONING);
				else {
					//notes are changed
					this.openModal();
				}
			} else {
				this.saveConcept(NO_VERSIONING);
			}
		};

		this.openModal = () => {
			this.setState({ showModal: true });
		};

		this.saveConcept = versioningType => {
			if (this.props.creation) {
				this.props.save(this.state.data);
			} else {
				//update
				this.props.save(
					this.props.id,
					versioningType,
					this.getOriginalData(),
					this.state.data
				);
			}
		};

		this.closeModal = versioningType => {
			this.setState({ showModal: false });
			if (versioningType) {
				this.setState({ actionRequested: true });
				this.saveConcept(versioningType);
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
			return areNotesImpactingVersionChanged(oldNotes, newNotes);
		};
	}

	render() {
		const {
			stampList,
			disseminationStatusList,
			pageTitle,
			creation,
		} = this.props;

		const {
			activeTab,
			showModal,
			data: { general, notes, conceptsWithLinks },
		} = this.state;

		const { disseminationStatus } = general;

		return (
			<div>
				<div className="container">
					{pageTitle}
					{this.props.general.contributor && (
						<ConceptCreateControl
							oldGeneral={this.getOriginalData().general}
							general={general}
							notes={notes}
							conceptsWithLinks={conceptsWithLinks}
							handleSave={this.handleSave}
							redirectCancel={this.redirectCancel}
						/>
					)}
					<ul className="nav nav-tabs nav-justified">
						<Tabs
							defaultActiveKey={0}
							id="informationToManage"
							onSelect={this.selectTab}
							justified
						>
							<Tab eventKey={0} title={dictionary.concept.general}>
								{activeTab === 0 && (
									<GeneralEdition
										general={general}
										handleChange={this.handleChangeGeneral}
										stampList={stampList}
										disseminationStatusList={disseminationStatusList}
									/>
								)}
							</Tab>
							<Tab eventKey={1} title={dictionary.notes.title}>
								{activeTab === 1 && (
									<NotesEdition
										notes={notes}
										handleChange={this.handleChangeNotes}
										disseminationStatus={disseminationStatus}
									/>
								)}
							</Tab>
							<Tab eventKey={2} title={dictionary.links.title}>
								{activeTab === 2 && (
									<LinksEdition
										conceptsWithLinks={conceptsWithLinks}
										currentId={this.state.id}
										handleChange={this.handleChangeLinks}
									/>
								)}
							</Tab>
						</Tabs>
					</ul>
				</div>
				<div>
					{!creation && (
						<Confirm
							isOpen={showModal}
							label={this.props.general.prefLabelLg1}
							versioningIsPossible={this.isVersioningPossible()}
							closeCancel={() => this.closeModal()}
							closeMinor={() => this.closeModal(NO_VERSIONING)}
							closeMajor={() => this.closeModal(VERSIONING)}
						/>
					)}
				</div>
			</div>
		);
	}
}

ConceptEditionCreation.propTypes = {
	id: PropTypes.string, // not available for creation
	creation: PropTypes.bool,
	pageTitle: PropTypes.element.isRequired,
	general: generalPropTypes.isRequired,
	notes: notePropTypes.isRequired,
	conceptsWithLinks: conceptsWithLinksPropTypes.isRequired,
	stampList: PropTypes.array.isRequired,
	disseminationStatusList: PropTypes.array.isRequired,
	save: PropTypes.func.isRequired,
};

export default ConceptEditionCreation;
