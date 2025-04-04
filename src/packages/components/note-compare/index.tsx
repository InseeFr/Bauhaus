import { useState } from 'react';

import { Select } from '@components/select-rmes';

import D from '../../deprecated-locales';
import { ExplanatoryNote } from '../explanatory-note';
import { Row } from '../layout';

interface CompareNotesTypes {
	version: number;
	secondLang: boolean;
	notes: any;
	buildNotes: any;
}

export const CompareNotes = ({
	secondLang,
	notes,
	version,
	buildNotes,
}: Readonly<CompareNotesTypes>) => {
	const [select1, setSelect1] = useState(version - 1);
	const [select2, setSelect2] = useState(version);
	const options = Array.from({ length: version }, (_, index) => ({
		value: `${index + 1}`,
		label: `${index + 1}`,
	}));

	const notesVersion1 = buildNotes(notes[select1]);
	const notesVersion2 = buildNotes(notes[select2]);

	return (
		<div>
			<Row>
				<div className="col-md-6 text-center">
					<Select
						options={options}
						placeholder={D.version}
						value={select1}
						onChange={(value) => setSelect1(Number(value))}
					/>
				</div>
				<div className="col-md-6 text-center">
					<Select
						options={options}
						placeholder={D.version}
						value={select2}
						onChange={(value) => setSelect2(Number(value))}
					/>
				</div>
			</Row>
			{notesVersion2.map((n: any, i: number) => (
				<Row key={`notes-compare-${i}`}>
					<ExplanatoryNote
						text={
							secondLang ? notesVersion1[i]['lg2'] : notesVersion1[i]['lg1']
						}
						title={D[notesVersion1[i].title]}
						alone={false}
					/>
					<ExplanatoryNote
						text={secondLang ? n.lg2 : n.lg1}
						title={D[n.title]}
						alone={false}
					/>
				</Row>
			))}
		</div>
	);
};
