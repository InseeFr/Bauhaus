import { NoteVisualization } from "@components/note-visualization";

import { stringToDate } from "@utils/date-utils";
import { delPTags } from "@utils/html-utils";

import { classificationsI18n } from "../../../../i18n";
import { buildNotes } from "../../../../utils/buildNotes";

export function ClassificationNotes({ secondLang, notes }: any) {
  const noteValues = buildNotes(notes).map((note: any) => {
    if (note.title === "classificationsChangeNote") {
      return classificationsI18n.t("item.changeNote", {
        lng: secondLang ? "en" : "fr",
        date: stringToDate(delPTags(notes.changeNoteDate)),
      });
    }
    return note;
  });

  return <NoteVisualization params={noteValues} secondLang={secondLang} md />;
}
