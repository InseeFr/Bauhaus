import { htmlLength } from "../../utils/html-utils";
import { ModifyNotes } from "./modify-notes";

export function NoteOneLangEdition({
  note,
  handleChange,
  maxLength,
}: Readonly<{
  note: string;
  handleChange: (value: string) => void;
  maxLength: number;
}>) {
  const noteLength = htmlLength(note);
  // Une note sans longueur maximale (`Infinity`) n'a pas de compteur à afficher.
  const checkLength = Number.isFinite(maxLength) && maxLength > 0 && (
    <div>
      {noteLength} / {maxLength}
    </div>
  );

  return (
    <div className="form-group text-center">
      <ModifyNotes note={note} handleChange={handleChange} />
      {checkLength}
    </div>
  );
}
