import { TabPanel, TabView } from "primereact/tabview";
import { useTranslation } from "react-i18next";

import { NoteEdition } from "@components/note-edition";

import { ConceptNotes } from "../../../../../model/concepts/concept";
import { htmlIsEmpty, htmlLength } from "../../../../../utils/html-utils";

interface NoteType {
  rawTitle:
    | "conceptsScopeNote"
    | "conceptsDefinition"
    | "conceptsEditorialNote"
    | "conceptsChangeNote";
  noteLg1Name: keyof ConceptNotes;
  noteLg2Name: keyof ConceptNotes;
  maxLength?: number;
}

const noteTypes = (maxLengthScopeNote: number): NoteType[] => [
  {
    rawTitle: "conceptsScopeNote",
    noteLg1Name: "scopeNoteLg1",
    noteLg2Name: "scopeNoteLg2",
    maxLength: maxLengthScopeNote,
  },
  {
    rawTitle: "conceptsDefinition",
    noteLg1Name: "definitionLg1",
    noteLg2Name: "definitionLg2",
  },
  {
    rawTitle: "conceptsEditorialNote",
    noteLg1Name: "editorialNoteLg1",
    noteLg2Name: "editorialNoteLg2",
  },
  {
    rawTitle: "conceptsChangeNote",
    noteLg1Name: "changeNoteLg1",
    noteLg2Name: "changeNoteLg2",
  },
];

type NoteFieldHandlers = Partial<Record<keyof ConceptNotes, (value: string) => void>>;

const handleFieldChange = (
  handleChange: (update: Partial<ConceptNotes>) => void,
  maxLengthScopeNote: number,
): NoteFieldHandlers =>
  noteTypes(maxLengthScopeNote).reduce<NoteFieldHandlers>(
    (handlers, { noteLg1Name, noteLg2Name }) => {
      handlers[noteLg1Name] = (value: string) => handleChange({ [noteLg1Name]: value });
      handlers[noteLg2Name] = (value: string) => handleChange({ [noteLg2Name]: value });
      return handlers;
    },
    {},
  );

interface NotesEditionProps {
  notes: ConceptNotes;
  disseminationStatus?: string;
  maxLengthScopeNote: number;
  handleChange: (update: Partial<ConceptNotes>) => void;
  errorMessage?: { errorMessage: string[]; fields: Record<string, string> };
}

const NotesEdition = ({
  notes,
  disseminationStatus,
  maxLengthScopeNote,
  handleChange,
  errorMessage,
}: Readonly<NotesEditionProps>) => {
  const { i18n } = useTranslation();
  const t1 = i18n.getFixedT("fr");
  const handlers = handleFieldChange(handleChange, maxLengthScopeNote);

  return (
    <TabView>
      {noteTypes(maxLengthScopeNote).map(({ rawTitle, noteLg1Name, noteLg2Name, maxLength }, i) => {
        const noteLg1 = notes[noteLg1Name] ?? "";
        const noteLg2 = notes[noteLg2Name] ?? "";

        const limit = maxLength ?? Number.POSITIVE_INFINITY;
        const highlight =
          (noteLg1Name === "definitionLg1" && htmlIsEmpty(noteLg1)) ||
          (noteLg1Name === "scopeNoteLg1" &&
            htmlIsEmpty(noteLg1) &&
            disseminationStatus?.includes("Public")) ||
          (noteLg1Name === "scopeNoteLg1" &&
            (htmlLength(noteLg1) > limit || htmlLength(noteLg2) > limit));
        const label = t1(`concept.notes.${rawTitle}`);
        const title = highlight ? <div className="red">{label}</div> : label;

        return (
          <TabPanel key={i} header={title}>
            <NoteEdition
              notes={notes}
              noteLg1Name={noteLg1Name}
              noteLg2Name={noteLg2Name}
              handleChangeLg1={handlers[noteLg1Name]!}
              handleChangeLg2={handlers[noteLg2Name]!}
              maxLength={limit}
              errorMessage={errorMessage!}
            />
          </TabPanel>
        );
      })}
    </TabView>
  );
};

export default NotesEdition;
