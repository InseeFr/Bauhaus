import NoteOneLangEdition from './note-one-lang-edition';
import D from '../../deprecated-locales';

type NoteEditionTypes = {
	noteLg1: string;
	handleChangeLg1: (value: string) => void;
	noteLg2: string;
	handleChangeLg2: (value: string) => void;
	maxLength: number;
};
export const NoteEdition = ({
	noteLg1,
	handleChangeLg1,
	noteLg2,
	handleChangeLg2,
	maxLength,
}: Readonly<NoteEditionTypes>) => {
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
