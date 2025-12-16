import { htmlLength } from "../../utils/html-utils";
import ModifyNotes from "./modify-notes";

function NoteOneLangEdition({
  note,
  handleChange,
  maxLength,
}: Readonly<{
  note: string;
  handleChange: (value: string) => void;
  maxLength: number;
}>) {
  const noteLength = htmlLength(note);
  const checkLength = maxLength && (
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

export default NoteOneLangEdition;
