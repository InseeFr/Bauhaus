import { WarningLogo } from '@inseefr/wilco';
import ModifyNotes from './modify-notes';
import { htmlLength } from '../../../new-architecture/utils/html-utils';

function NoteOneLangEdition({ note, handleChange, maxLength }) {
	const noteLength = htmlLength(note);
	const checkLength = maxLength && (
		<div>
			<div>
				{noteLength} / {maxLength}
			</div>
			<div>{noteLength > maxLength && <WarningLogo />}</div>
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
