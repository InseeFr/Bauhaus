import { D1, D2 } from '../../../i18n';
import { Row, ExplanatoryNote } from '../../../new-architecture/components';

const NoteVisualization = ({ params, langs, secondLang, md }) => (
	<>
		{params
			.filter((note) => !!note.lg1)
			.map((note, i) => (
				<Row key={`note-visualization-${i}`}>
					<ExplanatoryNote
						text={note.lg1}
						title={D1[note.title]}
						lang={langs.lg1}
						alone={!secondLang}
						md={md}
					/>
					{secondLang && (
						<ExplanatoryNote
							text={note.lg2}
							title={D2[note.title]}
							lang={langs.lg2}
							alone={false}
							md={md}
						/>
					)}
				</Row>
			))}
	</>
);

export default NoteVisualization;
