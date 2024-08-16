import NoteOneLangEdition from './note-one-lang-edition';
import D from '../../deprecated-locales';

type NoteEditionTypes = {
	noteLg1: string;
	handleChangeLg1: string;
	noteLg2: string;
	handleChangeLg2: string;
	maxLength: number;
};
export const NoteEdition = ({
	noteLg1,
	handleChangeLg1,
	noteLg2,
	handleChangeLg2,
	maxLength,
}: NoteEditionTypes) => {
	return (
		<div>
			<div className="row">
				<div className="col-md-6">
					<NoteOneLangEdition
						note={noteLg1}
						handleChange={handleChangeLg1}
						maxLength={maxLength}
					/>
				</div>
				<div className="col-md-6">
					<NoteOneLangEdition
						note={noteLg2}
						handleChange={handleChangeLg2}
						maxLength={maxLength}
					/>
				</div>
			</div>
			{maxLength && (
				<div className="row">
					<div className="row text-center boldRed">
						{maxLength} {D.scopeNoteChar}
					</div>
				</div>
			)}
		</div>
	);
};
