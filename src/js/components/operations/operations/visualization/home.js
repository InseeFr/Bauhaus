import React from 'react';
import PropTypes from 'prop-types';
import { Note } from 'js/components/shared/note';
import D from 'js/i18n';
import RelationsView from 'js/components/operations/shared/relations';

function OperationVisualization(props) {
	const {
		attr,
		secondLang,
		langs: { lg1, lg2 },
	} = props;

	return (
		<React.Fragment>
			<div className="row">
				<Note
					text={attr.altLabelLg1}
					title={D.altLabel}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
					context="operations"
				/>
				{secondLang && (
					<Note
						text={attr.altLabelLg2}
						title={D.altLabel}
						lang={lg2}
						alone={false}
						allowEmpty={true}
						context="operations"
					/>
				)}
			</div>
			<RelationsView
				parent={attr.series}
				parentTitle={D.parentSeries}
				parentPath="series"
				title={D.linksTitle}
				langs={{ lg1, lg2 }}
				secondLang={secondLang}
				context="operations"
			/>
		</React.Fragment>
	);
}

OperationVisualization.propTypes = {
	attr: PropTypes.object.isRequired,
};

export default OperationVisualization;
