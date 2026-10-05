import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { ErrorBloc } from "@components/errors-bloc";
import { ModalButton, ModalRmes } from "@components/modal-rmes/modal-rmes";
import { PageTitle } from "@components/page-title";

import { ConceptGeneral, ConceptNotes, Link } from "@model/concepts/concept";
import { UNPUBLISHED } from "@model/ValidationState";

import { VERSIONING, NO_VERSIONING } from "@sdk/constants";

import { toFormErrors } from "@utils/api-errors";

import type { SaveFn } from "../../../../hooks/useConceptSave";
import { areNotesImpactingVersionChanged } from "../../../../utils/areNotesImpactingVersionChanged";
import { resolveConceptSection } from "../../../../utils/conceptSection";
import { isVersioningPossible } from "../../../../utils/isVersioningPossible";
import { NoteRawTitle } from "../../../../utils/noteStatus";
import "./ConceptEditionCreation.css";
import { Menu } from "../menu";
import { validate } from "../validation";
import { ConceptGeneralEdition } from "./ConceptGeneralEdition";
import { ConceptSection, ConceptSummary } from "./ConceptSummary";
import { LinksEdition, ConceptWithLink } from "./LinksEdition";
import { NotesEdition } from "./NotesEdition";

type VersioningType = typeof VERSIONING | typeof NO_VERSIONING;

/** Champs du corps (`ConceptRequest`) qui ont un emplacement d'erreur dans les informations générales. */
const FIELDS_WITH_ERROR_SLOT = ["prefLabelLg1", "prefLabelLg2", "creator", "disseminationStatus"];

/** Erreurs de champ du serveur ajoutées aux erreurs client ; un message client non vide l'emporte. */
const withServerFieldErrors = (
  clientErrors: ValidationResult | undefined,
  serverFieldErrors: Record<string, string>,
): ValidationResult | undefined => {
  const serverMessages = Object.values(serverFieldErrors);
  if (serverMessages.length === 0) return clientErrors;
  const clientFields = Object.fromEntries(
    Object.entries(clientErrors?.fields ?? {}).filter(([, message]) => message),
  );
  return {
    fields: { ...clientErrors?.fields, ...serverFieldErrors, ...clientFields },
    errorMessage: [...(clientErrors?.errorMessage ?? []), ...serverMessages],
  };
};

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

interface ConceptEditionCreationProps {
  id?: string;
  creation?: boolean;
  title: string;
  subtitle?: string;
  general: ConceptGeneral;
  notes: ConceptNotes;
  conceptsWithLinks: ConceptWithLink[];
  equivalentLinks?: (Link & { urn: string })[];
  maxLengthScopeNote: number;
  save: SaveFn;
  submitting: boolean;
  setSubmitting: (value: boolean) => void;
  /** Partie à ouvrir au chargement, telle que retenue dans l'URL. */
  section?: string;
  /** Appelé avec la clé de la partie choisie, pour la retenir dans l'URL. */
  onSectionChange?: (section: string) => void;
  /** Rejet de la dernière tentative d'enregistrement. */
  serverSideError?: unknown;
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

export const ConceptEditionCreation = (props: ConceptEditionCreationProps) => {
  const {
    id,
    creation,
    title,
    subtitle,
    general,
    notes,
    conceptsWithLinks,
    equivalentLinks = [],
    maxLengthScopeNote,
    save,
    submitting,
    setSubmitting,
    section,
    onSectionChange,
    serverSideError,
  } = props;

  const { t } = useTranslation();

  // Un 400 de validation : les erreurs des champs affichés vont sous leur saisie, le reste au bandeau.
  const serverErrors = useMemo(
    () => toFormErrors(serverSideError, FIELDS_WITH_ERROR_SLOT),
    [serverSideError],
  );

  // Erreurs de champ du serveur encore affichées : chacune disparaît quand son champ est modifié,
  // et la liste repart de zéro à chaque nouveau rejet.
  const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string>>(
    () => serverErrors.clientSideErrors?.fields ?? {},
  );
  const [lastServerErrors, setLastServerErrors] = useState(serverErrors);
  if (lastServerErrors !== serverErrors) {
    setLastServerErrors(serverErrors);
    setServerFieldErrors(serverErrors.clientSideErrors?.fields ?? {});
  }

  const [state, setState] = useState<ConceptEditionCreationState>(() => {
    const initialSection = resolveConceptSection(section);
    return {
      id,
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
  });

  // La cible désigne ce qu'il faut afficher dans la section : une note, ou un
  // type de lien. Sans cible, on ouvre le premier de la liste.
  const handleSelectSection = (section: ConceptSection, target?: string) => {
    // La clé retenue dans l'URL est la plus précise : la note ou le type de lien
    // s'il y en a un, la section sinon.
    onSectionChange?.(target ?? section);
    const resolved = resolveConceptSection(target ?? section);
    setState((state) => ({
      ...state,
      activeSection: resolved.section,
      activeNote: resolved.note,
      activeLinkType: resolved.linkType,
    }));
  };

  const handleChangeGeneral = (update: Partial<ConceptGeneral>) => {
    setSubmitting(true);
    setServerFieldErrors((errors) =>
      Object.fromEntries(Object.entries(errors).filter(([field]) => !(field in update))),
    );
    setState((state) => onGeneralInformationChange(state, update));
  };

  const handleChangeNotes = (update: Partial<ConceptNotes>) => {
    setSubmitting(true);
    setState((state) => ({
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

  const handleChangeLinks = (newLinks: ConceptWithLink[]) => {
    setSubmitting(true);
    setState((state) => ({
      ...state,
      data: {
        ...state.data,
        conceptsWithLinks: newLinks,
      },
    }));
  };

  const handleChangeEquivalentLinks = (newLinks: (Link | { urn: string })[]) => {
    setSubmitting(true);
    setState((state) => ({
      ...state,
      data: {
        ...state.data,
        equivalentLinks: newLinks as (Link & { urn: string })[],
      },
    }));
  };

  const handleSave = () => {
    setState((state) => ({ ...state, saveAttempted: true }));
    if (computeErrors().errorMessage.length > 0) return;
    if (creation) {
      saveConcept();
    } else {
      askToConfirmOrSave();
    }
  };

  const computeErrors = (): ValidationResult => {
    const { general, notes, conceptsWithLinks } = state.data;
    return validate(
      general,
      notes,
      getOriginalData().general.prefLabelLg1,
      conceptsWithLinks,
      maxLengthScopeNote,
    );
  };

  const askToConfirmOrSave = () => {
    const isValidated = general.validationState !== UNPUBLISHED;
    if (isValidated) {
      if (!areNotesChanged()) return saveConcept(NO_VERSIONING);
      openModal();
    } else {
      saveConcept(NO_VERSIONING);
    }
  };

  const openModal = () => {
    setState((state) => ({ ...state, showModal: true }));
  };

  const saveConcept = (versioningType?: VersioningType) => {
    if (creation) {
      save(state.data);
    } else {
      save(id!, versioningType, getOriginalData(), state.data);
    }
  };

  const closeModal = (versioningType?: VersioningType) => {
    setState((state) => ({ ...state, showModal: false }));
    if (versioningType) {
      setState((state) => ({ ...state, actionRequested: true }));
      saveConcept(versioningType);
    }
  };

  const getOriginalData = (): ConceptData => ({
    general,
    notes,
    conceptsWithLinks,
    equivalentLinks: equivalentLinks ?? [],
  });

  const isVersioningPossibleFn = (): boolean => isVersioningPossible(notes, state.data.notes);

  const areNotesChanged = (): boolean => {
    const oldNotes = getOriginalData().notes;
    const newNotes = state.data.notes;
    return areNotesImpactingVersionChanged(oldNotes, newNotes);
  };

  const {
    showModal,
    activeSection,
    activeNote,
    activeLinkType,
    data: { general: dataGeneral, notes: dataNotes, conceptsWithLinks: dataConceptsWithLinks },
  } = state;

  const versioningPossible = isVersioningPossibleFn();

  const modalButtons: ModalButton[] = [
    {
      label: t("common.btnCancel"),
      action: () => closeModal(),
      style: "default",
      disabled: false,
    },
    {
      label: t("common.btnMinorVersion"),
      action: () => closeModal(NO_VERSIONING),
      style: "primary",
      disabled: false,
    },
    {
      label: t("common.btnMajorVersion"),
      action: () => closeModal(VERSIONING),
      style: "primary",
      disabled: !versioningPossible,
    },
  ];

  const modalBody = versioningPossible
    ? t("concept.versioning.body", { label: dataGeneral.prefLabelLg1 })
    : `${t("concept.versioning.body", { label: dataGeneral.prefLabelLg1 })}` +
      `<div class="alert alert-warning" style="margin-top: 1em; text-align: left;">` +
      `${t("concept.versioning.footer")}` +
      `</div>`;

  const errors = validate(
    dataGeneral,
    dataNotes,
    getOriginalData().general.prefLabelLg1,
    dataConceptsWithLinks,
    maxLengthScopeNote,
  );

  const displayedErrors = withServerFieldErrors(
    state.saveAttempted ? errors : undefined,
    serverFieldErrors,
  );

  return (
    <div>
      <div className="container">
        <PageTitle title={title} subtitle={subtitle} />
        {general.contributor && (
          <Menu errors={displayedErrors} handleSave={handleSave} submitting={submitting} />
        )}
        <ErrorBloc error={serverErrors.serverSideError} />
        <div className="concept-edition">
          <ConceptSummary
            notes={dataNotes}
            maxLengthScopeNote={maxLengthScopeNote}
            conceptsWithLinks={dataConceptsWithLinks}
            equivalentLinks={state.data.equivalentLinks}
            errorFields={displayedErrors?.fields}
            activeSection={activeSection}
            activeNote={activeNote}
            activeLinkType={activeLinkType}
            onSelect={handleSelectSection}
          />
          <div className="concept-edition__sections">
            {activeSection === "general" && (
              <section id="concept-general" className="concept-edition__section">
                <h3>{t("common.globalInformationsTitle")}</h3>
                <ConceptGeneralEdition
                  general={dataGeneral}
                  handleChange={handleChangeGeneral}
                  errorMessage={displayedErrors}
                />
              </section>
            )}
            {activeSection === "notes" && (
              <section id="concept-notes" className="concept-edition__section">
                <h3>{t("common.notesTitle")}</h3>
                <NotesEdition
                  notes={dataNotes}
                  handleChange={handleChangeNotes}
                  maxLengthScopeNote={maxLengthScopeNote}
                  disseminationStatus={dataGeneral.disseminationStatus}
                  errorMessage={displayedErrors}
                  activeNote={activeNote}
                />
              </section>
            )}
            {activeSection === "links" && (
              <section id="concept-links" className="concept-edition__section">
                <h3>{t("common.linksTitle")}</h3>
                <LinksEdition
                  conceptsWithLinks={dataConceptsWithLinks}
                  currentId={state.id}
                  handleChange={handleChangeLinks}
                  equivalentLinks={state.data.equivalentLinks}
                  handleChangeEquivalentLinks={handleChangeEquivalentLinks}
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
            closeCancel={() => closeModal()}
          />
        )}
      </div>
    </div>
  );
};
