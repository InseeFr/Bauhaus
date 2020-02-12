import React from 'react';
import PropTypes from 'prop-types';
import { Note } from '@inseefr/wilco';
import { D1, D2 } from 'js/i18n';
import RelationsView from 'js/applications/operations/shared/relations';

function OperationsOperationVisualization({
	attr,
	secondLang,
	langs: { lg1, lg2 },
}) {
	return (
		<React.Fragment>
			<div className="row">
				<Note
					text={attr.altLabelLg1}
					title={D1.altLabel}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={attr.altLabelLg2}
						title={D2.altLabel}
						lang={lg2}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</div>
			<RelationsView
				parent={attr.series}
				parentTitle={'parentSeries'}
				parentPath="series"
				title={'linksTitle'}
				langs={{ lg1, lg2 }}
				secondLang={secondLang}
			/>
		</React.Fragment>
	);
}

OperationsOperationVisualization.propTypes = {
	attr: PropTypes.object.isRequired,
};

export default OperationsOperationVisualization;
