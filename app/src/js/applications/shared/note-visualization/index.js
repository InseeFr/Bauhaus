import React from 'react';
import PropTypes from 'prop-types';
import { ExplanatoryNote } from 'js/applications/shared/explanatory-note';
import D, { D2 } from 'js/i18n';

const NoteVisualization = ({ params, langs, secondLang }) => (
	<div>
		{params.map((note, i) => (
			<span key={`note-visualization-${i}`}>
				{note.lg1 && (
					<div className="row">
						<ExplanatoryNote
							text={note.lg1}
							title={D[note.title]}
							lang={langs.lg1}
							alone={!secondLang}
						/>
						{secondLang && (
							<ExplanatoryNote
								text={note.lg2}
								title={D2[note.title]}
								lang={langs.lg2}
								alone={false}
							/>
						)}
					</div>
				)}
			</span>
		))}
	</div>
);

NoteVisualization.propTypes = {
	params: PropTypes.array.isRequired,
	langs: PropTypes.object.isRequired,
	secondLang: PropTypes.bool.isRequired,
	context: PropTypes.oneOf(['', 'concepts', 'classifications', 'operations']),
};

export default NoteVisualization;
