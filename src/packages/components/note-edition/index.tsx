import { useTranslation } from "react-i18next";

import { ConceptNotes } from "@model/concepts/concept";

import { useLocales } from "@utils/hooks/useLocales";
import { languageName } from "@utils/language-name";

import { ClientSideError } from "../errors-bloc";
import { Row } from "../layout";
import { NoteOneLangEdition } from "./note-one-lang-edition";

interface NoteEditionTypes {
  notes: ConceptNotes;
  noteLg1Name: keyof ConceptNotes;
  noteLg2Name: keyof ConceptNotes;
  handleChangeLg1: (value: string) => void;
  handleChangeLg2: (value: string) => void;
  maxLength: number;
  errorMessage: { errorMessage: string[]; fields: Record<string, string> };
}

export const NoteEdition = ({
  notes,
  noteLg1Name,
  noteLg2Name,
  handleChangeLg1,
  handleChangeLg2,
  maxLength,
  errorMessage,
}: Readonly<NoteEditionTypes>) => {
  const { i18n } = useTranslation();

  const { lg1, lg2 } = useLocales();

  const noteLg1 = notes[noteLg1Name];
  const noteLg2 = notes[noteLg2Name];

  return (
    <div>
      <Row>
        <div className="col-md-6">
          <span className="note-edition__lang">{languageName(lg1, i18n.language)}</span>
          <NoteOneLangEdition
            note={noteLg1 ?? ""}
            handleChange={handleChangeLg1}
            maxLength={maxLength}
          />
          <ClientSideError
            id="note-lg1-error"
            error={errorMessage?.fields[noteLg1Name]}
          ></ClientSideError>
        </div>
        <div className="col-md-6">
          <span className="note-edition__lang">{languageName(lg2, i18n.language)}</span>
          <NoteOneLangEdition
            note={noteLg2 ?? ""}
            handleChange={handleChangeLg2}
            maxLength={maxLength}
          />
          <ClientSideError
            id="note-lg2-error"
            error={errorMessage?.fields[noteLg2Name]}
          ></ClientSideError>
        </div>
      </Row>
    </div>
  );
};
