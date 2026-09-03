import { Component } from "react";
import { withTranslation, WithTranslation } from "react-i18next";

import { ModalButton, ModalRmes } from "@components/modal-rmes/modal-rmes";
import { PageTitle } from "@components/page-title";

import { VERSIONING, NO_VERSIONING } from "@sdk/constants";

import { ConceptGeneral, ConceptNotes, Link } from "../../../../../model/concepts/concept";
import { UNPUBLISHED } from "@model/ValidationState";
import { areNotesImpactingVersionChanged } from "../../../../utils/areNotesImpactingVersionChanged";
import { isVersioningPossible } from "../../../../utils/isVersioningPossible";
import { resolveConceptSection } from "../../../../utils/conceptSection";
import { LINK_TYPES } from "../../../../utils/linkTypes";
import { NoteRawTitle } from "../../../../utils/noteStatus";
import { ConceptSection, ConceptSummary } from "./ConceptSummary";
import "./ConceptEditionCreation.css";
import { Menu } from "../menu";
import { validate } from "../validation";
import GeneralEdition from "./ConceptGeneralEdition";
import LinksEdition, { ConceptWithLink } from "./LinksEdition";
import type { SaveFn } from "../../../../hooks/useConceptSave";
import NotesEdition from "./NotesEdition";

type VersioningType = typeof VERSIONING | typeof NO_VERSIONING;

interface ValidationResult {
  fields: Record<string, string>;
  errorMessage: string[];
}

export interface ConceptData {
  general: ConceptGeneral;
  notes: ConceptNotes;
  conceptsWithLinks: ConceptWithLink[];
  equivalentLinks: (Link & { urn: string })[];
}

// Le type vit avec la fonction qui le produit : deux déclarations homonymes mais
// structurellement différentes rendaient `save` non transmissible d'un module à l'autre.
export type { SaveFn };

interface ConceptEditionCreationProps extends WithTranslation {
  id?: string;
  creation?: boolean;
  title: string;
  subtitle?: string;
  general: ConceptGeneral;
  notes: ConceptNotes;
  conceptsWithLinks: ConceptWithLink[];
  equivalentLinks?: (Link & { urn: string })[];
  maxLengthScopeNote: number;
  stampList?: { value: string; label: string }[];
  save: SaveFn;
  submitting: boolean;
  setSubmitting: (value: boolean) => void;
  /** Partie à ouvrir au chargement, telle que retenue dans l'URL. */
  section?: string;
  /** Appelé avec la clé de la partie choisie, pour la retenir dans l'URL. */
  onSectionChange?: (section: string) => void;
}

interface ConceptEditionCreationState {
  id: string | undefined;
  showModal: boolean;
  saveAttempted: boolean;
  actionRequested?: boolean;
  activeSection: ConceptSection;
  activeNote: NoteRawTitle;
  activeLinkType: string;
  data: ConceptData;
}

export const onGeneralInformationChange = (
  state: ConceptEditionCreationState,
  update: Partial<ConceptGeneral>,
): ConceptEditionCreationState => ({
  ...state,
  data: {
    ...state.data,
    general: {
      ...state.data.general,
      ...update,
    },
  },
});

class ConceptEditionCreation extends Component<
  ConceptEditionCreationProps,
  ConceptEditionCreationState
> {
  constructor(props: ConceptEditionCreationProps) {
    super(props);
    const { general, notes, conceptsWithLinks, equivalentLinks = [] } = props;
    const initialSection = resolveConceptSection(props.section);
    this.state = {
      id: this.props.id,
      showModal: false,
      saveAttempted: false,
      activeSection: initialSection.section,
      activeNote: initialSection.note,
      activeLinkType: initialSection.linkType,
      data: {
        general: { ...general },
        notes: { ...notes },
        conceptsWithLinks: [...conceptsWithLinks],
        equivalentLinks,
      },
    };
  }

  // La cible désigne ce qu'il faut afficher dans la section : une note, ou un
  // type de lien. Sans cible, on ouvre le premier de la liste.
  handleSelectSection = (section: ConceptSection, target?: string) => {
    // La clé retenue dans l'URL est la plus précise : la note ou le type de lien
    // s'il y en a un, la section sinon.
    this.props.onSectionChange?.(target ?? section);
    const resolved = resolveConceptSection(target ?? section);
    this.setState({
      activeSection: resolved.section,
      activeNote: resolved.note,
      activeLinkType: resolved.linkType,
    });
  };

  handleChangeGeneral = (update: Partial<ConceptGeneral>) => {
    this.props.setSubmitting(true);
    this.setState((state) => onGeneralInformationChange(state, update));
  };

  handleChangeNotes = (update: Partial<ConceptNotes>) => {
    this.props.setSubmitting(true);
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

  handleChangeLinks = (newLinks: ConceptWithLink[]) => {
    this.props.setSubmitting(true);
    this.setState((state) => ({
      ...state,
      data: {
        ...state.data,
        conceptsWithLinks: newLinks,
      },
    }));
  };

  handleChangeEquivalentLinks = (newLinks: (Link | { urn: string })[]) => {
    this.props.setSubmitting(true);
    this.setState((state) => ({
      ...state,
      data: {
        ...state.data,
        equivalentLinks: newLinks as (Link & { urn: string })[],
      },
    }));
  };

  handleSave = () => {
    this.setState({ saveAttempted: true });
    if (this.computeErrors().errorMessage.length > 0) return;
    if (this.props.creation) {
      this.saveConcept();
    } else {
      this.askToConfirmOrSave();
    }
  };

  computeErrors = (): ValidationResult => {
    const { general, notes, conceptsWithLinks } = this.state.data;
    return validate(
      general,
      notes,
      this.getOriginalData().general.prefLabelLg1,
      conceptsWithLinks,
      this.props.maxLengthScopeNote,
    );
  };

  askToConfirmOrSave = () => {
    const isValidated = this.props.general.validationState !== UNPUBLISHED;
    if (isValidated) {
      if (!this.areNotesChanged()) return this.saveConcept(NO_VERSIONING);
      this.openModal();
    } else {
      this.saveConcept(NO_VERSIONING);
    }
  };

  openModal = () => {
    this.setState({ showModal: true });
  };

  saveConcept = (versioningType?: VersioningType) => {
    if (this.props.creation) {
      this.props.save(this.state.data);
    } else {
      this.props.save(this.props.id!, versioningType, this.getOriginalData(), this.state.data);
    }
  };

  closeModal = (versioningType?: VersioningType) => {
    this.setState({ showModal: false });
    if (versioningType) {
      this.setState({ actionRequested: true });
      this.saveConcept(versioningType);
    }
  };

  getOriginalData = (): ConceptData => ({
    general: this.props.general,
    notes: this.props.notes,
    conceptsWithLinks: this.props.conceptsWithLinks,
    equivalentLinks: this.props.equivalentLinks ?? [],
  });

  isVersioningPossible = (): boolean =>
    isVersioningPossible(this.props.notes, this.state.data.notes);

  areNotesChanged = (): boolean => {
    const oldNotes = this.getOriginalData().notes;
    const newNotes = this.state.data.notes;
    return areNotesImpactingVersionChanged(oldNotes, newNotes);
  };

  render() {
    const { maxLengthScopeNote, title, subtitle, creation, submitting, t } = this.props;

    const {
      showModal,
      activeSection,
      activeNote,
      activeLinkType,
      data: { general, notes, conceptsWithLinks },
    } = this.state;

    const versioningPossible = this.isVersioningPossible();
    const modalButtons: ModalButton[] = [
      {
        label: t("common.btnCancel"),
        action: () => this.closeModal(),
        style: "default",
        disabled: false,
      },
      {
        label: t("common.btnMinorVersion"),
        action: () => this.closeModal(NO_VERSIONING),
        style: "primary",
        disabled: false,
      },
      {
        label: t("common.btnMajorVersion"),
        action: () => this.closeModal(VERSIONING),
        style: "primary",
        disabled: !versioningPossible,
      },
    ];

    const modalBody = versioningPossible
      ? t("concept.versioning.body", { label: general.prefLabelLg1 })
      : `${t("concept.versioning.body", { label: general.prefLabelLg1 })}` +
        `<div class="alert alert-warning" style="margin-top: 1em; text-align: left;">` +
        `${t("concept.versioning.footer")}` +
        `</div>`;

    const errors = validate(
      general,
      notes,
      this.getOriginalData().general.prefLabelLg1,
      conceptsWithLinks,
      maxLengthScopeNote,
    );
    const displayedErrors = this.state.saveAttempted ? errors : undefined;
    return (
      <div>
        <div className="container">
          <PageTitle title={title} subtitle={subtitle} />
          {this.props.general.contributor && (
            <Menu errors={displayedErrors} handleSave={this.handleSave} submitting={submitting} />
          )}
          <div className="concept-edition">
            <ConceptSummary
              notes={notes}
              maxLengthScopeNote={maxLengthScopeNote}
              conceptsWithLinks={conceptsWithLinks}
              equivalentLinks={this.state.data.equivalentLinks}
              errorFields={displayedErrors?.fields}
              activeSection={activeSection}
              activeNote={activeNote}
              activeLinkType={activeLinkType}
              onSelect={this.handleSelectSection}
            />
            <div className="concept-edition__sections">
              {activeSection === "general" && (
                <section id="concept-general" className="concept-edition__section">
                  <h3>{t("common.globalInformationsTitle")}</h3>
                  <GeneralEdition
                    general={general}
                    handleChange={this.handleChangeGeneral}
                    errorMessage={displayedErrors}
                  />
                </section>
              )}
              {activeSection === "notes" && (
                <section id="concept-notes" className="concept-edition__section">
                  <h3>{t("common.notesTitle")}</h3>
                  <NotesEdition
                    notes={notes}
                    handleChange={this.handleChangeNotes}
                    maxLengthScopeNote={maxLengthScopeNote}
                    disseminationStatus={general.disseminationStatus}
                    errorMessage={displayedErrors}
                    activeNote={activeNote}
                  />
                </section>
              )}
              {activeSection === "links" && (
                <section id="concept-links" className="concept-edition__section">
                  <h3>{t("common.linksTitle")}</h3>
                  <LinksEdition
                    conceptsWithLinks={conceptsWithLinks}
                    currentId={this.state.id}
                    handleChange={this.handleChangeLinks}
                    equivalentLinks={this.state.data.equivalentLinks}
                    handleChangeEquivalentLinks={this.handleChangeEquivalentLinks}
                    activeLinkType={activeLinkType}
                  />
                </section>
              )}
            </div>
          </div>
        </div>
        <div>
          {!creation && (
            <ModalRmes
              id="versioning-modal"
              isOpen={showModal}
              title={t("concept.versioning.title")}
              body={modalBody as unknown as Node}
              modalButtons={modalButtons}
              closeCancel={() => this.closeModal()}
            />
          )}
        </div>
      </div>
    );
  }
}

export default withTranslation()(ConceptEditionCreation);
