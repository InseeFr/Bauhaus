import { rawHtmlToRmesHtml } from "@utils/html-utils";

import { ConceptNotes } from "../../model/concepts/concept";

export const extractDatableConceptNotes = (
  notesToKeep: ConceptNotes,
  fields: (keyof ConceptNotes)[],
) =>
  fields.reduce((notes: { noteType: string; content: string }[], noteType: keyof ConceptNotes) => {
    const content = notesToKeep[noteType];

    if (content)
      notes.push({
        noteType,
        //format the note the `rmes` way (with a wrapping div and a
        //namespace attribte).
        content: rawHtmlToRmesHtml(content),
      });

    return notes;
  }, []);
