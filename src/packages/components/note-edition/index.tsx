import NoteOneLangEdition from './note-one-lang-edition';
import { ClientSideError } from '../errors-bloc';

type NoteEditionTypes = {
	notes: any;
	noteLg1Name: string;
	noteLg2Name: string;
	handleChangeLg1: (value: string) => void;
	handleChangeLg2: (value: string) => void;
	maxLength: number;
	errorMessage: { errorMessage: string[]; fields: any };
};
export const NoteEdition = ({
	notes,
	noteLg1Name,
	noteLg2Name,
	handleChangeLg1,
	handleChangeLg2,
	maxLength,
	errorMessage,
}: Readonly<NoteEditionTypes>) => {
	const noteLg1 = notes[noteLg1Name];
	const noteLg2 = notes[noteLg2Name];
	return (
		<div>
			<div className="row">
				<div className="col-md-6">
					<>
						<NoteOneLangEdition
							note={noteLg1}
							handleChange={handleChangeLg1}
							maxLength={maxLength}
						/>
						<ClientSideError
							id="note-lg1-error"
							error={errorMessage?.fields[noteLg1Name]}
						></ClientSideError>
					</>
				</div>
				<div className="col-md-6">
					<>
						<NoteOneLangEdition
							note={noteLg2}
							handleChange={handleChangeLg2}
							maxLength={maxLength}
						/>
						<ClientSideError
							id="note-lg2-error"
							error={errorMessage?.fields[noteLg2Name]}
						></ClientSideError>
					</>
				</div>
			</div>
		</div>
	);
};
