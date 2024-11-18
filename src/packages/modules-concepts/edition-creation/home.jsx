import { Component } from 'react';
import { ModalRmes } from '../../components/modal-rmes/modal-rmes';
import ConceptCreateControlLayout from './controls/controls-layout';
import GeneralEdition from './general';
import NotesEdition from './notes';
import LinksEdition from './links';
import D from '../../deprecated-locales';
import { VERSIONING, NO_VERSIONING } from '@sdk/constants';
import { validate } from './controls/validation';
import { areNotesImpactingVersionChanged } from '../utils/notes';
import isVersioningPossible from '../../modules-concepts/utils/is-versioning-possible';
import { TabPanel, TabView } from 'primereact/tabview';
import { PageTitle } from '@components/page-title';

export const onGeneralInformationChange = (state, update) => ({
	...state,
	data: {
		...state.data,
		general: {
			...state.data.general,
			...update,
		},
	},
});

class ConceptEditionCreation extends Component {
	constructor(props) {
		super(props);
		const {
			general,
			notes,
			conceptsWithLinks,
			equivalentLinks = [],
			setSubmitting,
		} = props;
		this.state = {
			id: this.props.id,
			showModal: false,
			data: {
				general: { ...general },
				notes: { ...notes },
				conceptsWithLinks: [...conceptsWithLinks],
				equivalentLinks: equivalentLinks,
			},
		};

		//update should look like `{ prefLabelLg2: 'something new' }` (we can
		//set mutliple properties at the same time)
		this.handleChangeGeneral = (update) => {
			setSubmitting(true);
			this.setState((state) => onGeneralInformationChange(state, update));
		};

		//update should look like `{ editorialNoteLg1: '...' }`
		this.handleChangeNotes = (update) => {
			setSubmitting(true);
			this.setState((state) => ({
				...state,
				data: {
					...state.data,
					notes: {
						...state.data.notes,
						...update,
					},
				},
			}));
		};

		this.handleChangeLinks = (newLinks) => {
			setSubmitting(true);
			this.setState((state) => ({
				data: {
					...state.data,
					conceptsWithLinks: newLinks,
				},
			}));
		};

		this.handleChangeEquivalentLinks = (newLinks) => {
			setSubmitting(true);
			this.setState((state) => ({
				data: {
					...state.data,
					equivalentLinks: newLinks,
				},
			}));
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
					this.state.data,
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
		const {
			stampList,
			maxLengthScopeNote,
			title,
			subtitle,
			creation,
			submitting,
		} = this.props;

		const {
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
			general,
			notes,
			this.getOriginalData().general.prefLabelLg1,
			conceptsWithLinks,
			maxLengthScopeNote,
		);
		return (
			<div>
				<div className="container">
					<PageTitle title={title} subtitle={subtitle} />
					{this.props.general.contributor && (
						<ConceptCreateControlLayout
							errors={errorMessage}
							handleSave={this.handleSave}
							submitting={submitting}
						/>
					)}
					<TabView>
						<TabPanel header={D.globalInformationsTitle}>
							<GeneralEdition
								general={general}
								handleChange={this.handleChangeGeneral}
								stampList={stampList}
								errorMessage={errorMessage}
							/>
						</TabPanel>
						<TabPanel header={D.notesTitle}>
							<NotesEdition
								notes={notes}
								handleChange={this.handleChangeNotes}
								maxLengthScopeNote={maxLengthScopeNote}
								disseminationStatus={general.disseminationStatus}
								errorMessage={errorMessage}
							/>
						</TabPanel>
						<TabPanel header={D.linksTitle}>
							<LinksEdition
								conceptsWithLinks={conceptsWithLinks}
								currentId={this.state.id}
								handleChange={this.handleChangeLinks}
								equivalentLinks={this.state.data.equivalentLinks}
								handleChangeEquivalentLinks={this.handleChangeEquivalentLinks}
							/>
						</TabPanel>
					</TabView>
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
							closeCancel={this.closeModal}
						/>
					)}
				</div>
			</div>
		);
	}
}

export default ConceptEditionCreation;
