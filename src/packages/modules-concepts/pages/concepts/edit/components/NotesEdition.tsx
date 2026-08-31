import { useTranslation } from "react-i18next";

import { NoteEdition } from "@components/note-edition";

import { ConceptNotes } from "../../../../../model/concepts/concept";
import { NoteRawTitle, noteTypes } from "../../../../utils/noteStatus";
import "./NotesEdition.css";

interface NotesEditionProps {
  notes: ConceptNotes;
  disseminationStatus?: string;
  maxLengthScopeNote: number;
  handleChange: (update: Partial<ConceptNotes>) => void;
  errorMessage?: { errorMessage: string[]; fields: Record<string, string> };
  /** Note à éditer : c'est le sommaire qui en décide. */
  activeNote: NoteRawTitle;
}

export const NotesEdition = ({
  notes,
  maxLengthScopeNote,
  handleChange,
  errorMessage,
  activeNote,
}: Readonly<NotesEditionProps>) => {
  const { t, i18n } = useTranslation();
  // Les intitulés des notes sont ceux du thésaurus : ils restent en français.
  const t1 = i18n.getFixedT("fr");

  const noteType = noteTypes(maxLengthScopeNote).find(({ rawTitle }) => rawTitle === activeNote);
  if (!noteType) return null;

  const { rawTitle, noteLg1Name, noteLg2Name, maxLength } = noteType;
  const title = t1(`concept.notes.${rawTitle}`);

  return (
    <section className="notes-edition__note" aria-label={title}>
      <header className="notes-edition__header">
        <h4>{title}</h4>
        {maxLength !== undefined && (
          <span className="notes-edition__max-length">
            {t("concept.notes.maxLengthReminder", { max: maxLength })}
          </span>
        )}
      </header>
      <NoteEdition
        notes={notes}
        noteLg1Name={noteLg1Name}
        noteLg2Name={noteLg2Name}
        handleChangeLg1={(value: string) => handleChange({ [noteLg1Name]: value })}
        handleChangeLg2={(value: string) => handleChange({ [noteLg2Name]: value })}
        maxLength={maxLength ?? Number.POSITIVE_INFINITY}
        errorMessage={errorMessage!}
      />
    </section>
  );
};
