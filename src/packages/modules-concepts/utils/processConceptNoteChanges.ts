import { ConceptNotes } from "@model/concepts/concept";

import { rawHtmlToRmesHtml } from "@utils/html-utils";

export const processConceptNoteChanges = (
  oldNotes: ConceptNotes,
  notes: ConceptNotes,
  fields: (keyof ConceptNotes)[],
) =>
  fields.reduce(
    (changes: { noteType: string; content: string }[], noteType: keyof ConceptNotes) => {
      const oldContent = oldNotes[noteType];
      const content = notes[noteType];
      if (oldContent !== content)
        changes.push({
          noteType,
          //format the note the `rmes` way (with a wrapping div and a
          //namespace attribte).
          content: rawHtmlToRmesHtml(content ?? ""),
        });
      return changes;
    },
    [],
  );
