import { ExplanatoryNote } from '@components/explanatory-note';
import { Row } from '@components/layout';

import { D1, D2 } from '../../deprecated-locales';

interface NoteVizualizationTypes {
	params: any[];
	secondLang: boolean;
	md?: boolean;
}
export const NoteVisualization = ({
	params,
	secondLang,
	md,
}: Readonly<NoteVizualizationTypes>) => {
	return (
		<>
			{params
				.filter((note) => !!note.lg1)
				.map((note: any, i) => (
					<Row key={`note-visualization-${i}`}>
						<ExplanatoryNote
							text={note.lg1}
							title={D1[note.title]}
							alone={!secondLang}
							md={md}
						/>
						{secondLang && (
							<ExplanatoryNote
								text={note.lg2}
								title={D2[note.title]}
								alone={false}
								md={md}
							/>
						)}
					</Row>
				))}
		</>
	);
};
