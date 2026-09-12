import { ConceptGeneral, ConceptNotes } from "@model/concepts/concept";

import { rawHtmlToRmesHtml } from "@utils/html-utils";
import { takeKeys } from "@utils/take-keys";

import { processGeneral } from "./processGeneral";
import { processLinks } from "./processLinks";

interface ConceptCreationInput {
  general: ConceptGeneral;
  notes: ConceptNotes;
  conceptsWithLinks: { id: string; typeOfLink: string }[];
}

interface NoteEntry {
  noteType: string;
  content: string;
}

const generalFieldsToKeep: (keyof ConceptGeneral)[] = [
  "prefLabelLg1",
  "prefLabelLg2",
  "altLabelLg1",
  "altLabelLg2",
  "creator",
  "contributor",
  "disseminationStatus",
  "additionalMaterial",
  "valid",
  "collections",
];

const extractVersNotes = takeKeys([
  "scopeNoteLg1",
  "scopeNoteLg2",
  "definitionLg1",
  "definitionLg2",
  "editorialNoteLg1",
  "editorialNoteLg2",
]);

export function buildPayloadCreation(concept: ConceptCreationInput) {
  const { general: rawGeneral, notes, conceptsWithLinks } = concept;

  const general = processGeneral(rawGeneral, generalFieldsToKeep);

  const links = processLinks(conceptsWithLinks);

  const versNotesObj = extractVersNotes(
    notes as unknown as Record<string, unknown>,
  ) as Partial<ConceptNotes>;

  const versionableNotes = (Object.keys(versNotesObj) as (keyof ConceptNotes)[]).reduce<
    NoteEntry[]
  >((arr, noteType) => {
    const content = versNotesObj[noteType];
    if (content) {
      arr.push({
        noteType,
        content: rawHtmlToRmesHtml(content),
      });
    }
    return arr;
  }, []);

  const datableNoteTypes: (keyof ConceptNotes)[] = ["changeNoteLg1", "changeNoteLg2"];

  const datableNotes = datableNoteTypes
    .map((noteType): NoteEntry | null => {
      const content = notes[noteType];
      if (content) {
        return {
          noteType,
          content: rawHtmlToRmesHtml(content),
        };
      }
      return null;
    })
    .filter((note): note is NoteEntry => note !== null);

  return {
    ...general,
    versionableNotes,
    datableNotes,
    links,
  };
}
