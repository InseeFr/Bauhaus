import React from 'react';
import PropTypes from 'prop-types';
import { ExplanatoryNote } from 'js/components/shared/explanatory-note';

const NoteVisualization = ({ params, langs, secondLang, context }) => (
	<div>
		{params.map((note, i) => (
			<span key={`note-visualization-${i}`}>
				{note.lg1 && (
					<div className="row">
						<ExplanatoryNote
							text={note.lg1}
							title={note.title}
							lang={langs.lg1}
							alone={!secondLang}
							context={context}
						/>
						{secondLang && (
							<ExplanatoryNote
								text={note.lg2}
								title={note.title}
								lang={langs.lg2}
								alone={false}
								context={context}
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
