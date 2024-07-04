import { LogoWarning } from '@inseefr/wilco';
import ModifyNotes from './modify-notes';
import { HTMLUtils } from 'js/utils';

function NoteOneLangEdition({ note, handleChange, maxLength }) {
	const noteLength = HTMLUtils.htmlLength(note);
	const checkLength = maxLength && (
		<div>
			<div>
				{noteLength} / {maxLength}
			</div>
			<div>{noteLength > maxLength && LogoWarning}</div>
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
