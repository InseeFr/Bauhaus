import React from 'react';
import PropTypes from 'prop-types';
import { ExplanatoryNote } from 'js/applications/shared/explanatory-note';
import { D1, D2 } from 'js/i18n';
import { Row } from 'bauhaus-utilities';

const NoteVisualization = ({ params, langs, secondLang }) => (
	<>
		{params.filter(note => !!note.lg1).map((note, i) => (
				<Row key={`note-visualization-${i}`}>
					<ExplanatoryNote
						text={note.lg1}
						title={D1[note.title]}
						lang={langs.lg1}
						alone={!secondLang}
						md
					/>
					{secondLang && (
						<ExplanatoryNote
							text={note.lg2}
							title={D2[note.title]}
							lang={langs.lg2}
							alone={false}
							md
						/>
					)}
				</Row>
		))}
	</>
);

NoteVisualization.propTypes = {
	params: PropTypes.array.isRequired,
	langs: PropTypes.object.isRequired,
	secondLang: PropTypes.bool.isRequired,
};

export default NoteVisualization;
