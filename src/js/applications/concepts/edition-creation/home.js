import { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { goBack } from '@inseefr/wilco';
import { PageTitle } from 'js/new-architecture/components';

import ConceptCreateControl from './controls';
import GeneralEdition from './general';
import NotesEdition from './notes';
import LinksEdition from './links';
import ModalRmes from 'js/applications/shared/modal-rmes/modal-rmes';
import { areNotesImpactingVersionChanged } from 'js/utils/concepts/notes';
import D from 'js/i18n';
import isVersioningPossible from 'js/utils/concepts/is-versioning-possible';
import { VERSIONING, NO_VERSIONING } from 'js/constants';
import { withRouter } from 'react-router-dom';
import { withTitle } from 'js/utils';
import validate from './controls/validation';

class ConceptEditionCreation extends Component {
	constructor(props) {
		super(props);
		const { general, notes, conceptsWithLinks, equivalentLinks = [] } = props;
		this.state = {
			id: this.props.id,
			activeTab: 0,
			showModal: false,
			data: {
				general: { ...general },
				notes: { ...notes },
				conceptsWithLinks: [...conceptsWithLinks],
				equivalentLinks: equivalentLinks,
			},
		};

		this.selectTab = (tabIndex) =>
			this.setState({
				activeTab: tabIndex,
			});
		//update should look like `{ prefLabelLg2: 'something new' }` (we can
		//set mutliple properties at the same time)
		this.handleChangeGeneral = (update) => {
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
		this.handleChangeNotes = (update) => {
			const data = this.state.data;
			const notes = data.notes;
			const newData = Object.assign(data, {
				notes: Object.assign(notes, update),
			});
			this.setState({
				data: newData,
			});
		};

		this.handleChangeLinks = (newLinks) => {
			this.setState({
				data: {
					...this.state.data,
					conceptsWithLinks: newLinks,
				},
			});
		};

		this.handleChangeEquivalentLinks = (newLinks) => {
			this.setState({
				data: {
					...this.state.data,
					equivalentLinks: newLinks,
				},
			});
		};

		this.handleSave = () => {
			if (this.props.creation) {
				this.saveConcept();
			} else {
				//show modal if needed
				this.askToConfirmOrSave();
			}
		};

		this.askToConfirmOrSave = () => {
			const isValidated = this.props.general.isValidated === 'true';
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

		this.saveConcept = (versioningType) => {
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

		this.closeModal = (versioningType) => {
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
		const { stampList, maxLengthScopeNote, title, subtitle, creation, langs } =
			this.props;

		const {
			activeTab,
			showModal,
			data: { general, notes, conceptsWithLinks },
		} = this.state;

		const modalButtons = [
			{
				label: D.btnMinorVersion,
				action: () => this.closeModal(NO_VERSIONING),
				style: 'primary',
			},
			{
				label: D.btnCancel,
				action: () => this.closeModal(),
				style: 'default',
			},
			{
				label: D.btnMajorVersion,
				action: () => this.closeModal(VERSIONING),
				style: 'primary',
				disabled: !this.isVersioningPossible(),
			},
		];

		const errorMessage = validate(
			this.getOriginalData().general,
			general,
			notes,
			conceptsWithLinks,
			maxLengthScopeNote
		);

		return (
			<div>
				<div className="container">
					<PageTitle title={title} subtitle={subtitle} />
					{this.props.general.contributor && (
						<ConceptCreateControl
							errorMessage={errorMessage}
							handleSave={this.handleSave}
							redirectCancel={goBack(this.props, 'concepts')}
						/>
					)}
					<ul className="nav nav-tabs nav-justified">
						<Tabs
							defaultActiveKey={0}
							id="informationToManage"
							onSelect={this.selectTab}
							justified
						>
							<Tab eventKey={0} title={D.globalInformationsTitle}>
								{activeTab === 0 && (
									<GeneralEdition
										general={general}
										handleChange={this.handleChangeGeneral}
										stampList={stampList}
										langs={langs}
										errorMessage={errorMessage}
									/>
								)}
							</Tab>
							<Tab eventKey={1} title={D.notesTitle}>
								{activeTab === 1 && (
									<NotesEdition
										notes={notes}
										handleChange={this.handleChangeNotes}
										maxLengthScopeNote={maxLengthScopeNote}
										disseminationStatus={general.disseminationStatus}
										langs={langs}
										errorMessage={errorMessage}
									/>
								)}
							</Tab>
							<Tab eventKey={2} title={D.linksTitle}>
								{activeTab === 2 && (
									<LinksEdition
										conceptsWithLinks={conceptsWithLinks}
										currentId={this.state.id}
										handleChange={this.handleChangeLinks}
										equivalentLinks={this.state.data.equivalentLinks}
										handleChangeEquivalentLinks={
											this.handleChangeEquivalentLinks
										}
									/>
								)}
							</Tab>
						</Tabs>
					</ul>
				</div>
				<div>
					{!creation && (
						<ModalRmes
							id="versioning-modal"
							isOpen={showModal}
							title={D.conceptVersioningTitle}
							body={D.conceptVersioningBody(general.prefLabelLg1)}
							footer={
								this.isVersioningPossible() ? '' : D.conceptVersioningFooter
							}
							modalButtons={modalButtons}
							closeCancel={() => this.closeModal()}
						/>
					)}
				</div>
			</div>
		);
	}
}

export default withRouter(
	withTitle(
		ConceptEditionCreation,
		D.conceptsTitle,
		(props) => props?.general?.prefLabelLg1 || D.createConceptTitle
	)
);
