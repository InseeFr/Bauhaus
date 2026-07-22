import i18next from "i18next";

import { NoteVisualization } from "@components/note-visualization";

import { stringToDate } from "@utils/date-utils";
import { delPTags } from "@utils/html-utils";

import { buildNotes } from "../../../../utils/buildNotes";

export function ClassificationNotes({ secondLang, notes }: any) {
  const noteValues = buildNotes(notes).map((note: any) => {
    if (note.title === "classificationsChangeNote") {
      return i18next.t("item.changeNote", {
        lng: secondLang ? "en" : "fr",
        date: stringToDate(delPTags(notes.changeNoteDate)),
      });
    }
    return note;
  });

  return <NoteVisualization params={noteValues} secondLang={secondLang} md />;
}
