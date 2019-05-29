import { Note } from 'js/components/shared/note/note';
import D from 'js/i18n';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * @typedef OperationsDocumentationVisualizationProps
 * @property {any} attr
 * @property {boolean} secondLang
 * @property {{ lg1: string, lg2: string }} langs
 *
 * @param {OperationsDocumentationVisualizationProps} props
 */
function OperationsDocumentationVisualization({
	attr,
	secondLang,
	langs: { lg1, lg2 },
}) {
	return (
		<React.Fragment>
			<div className="row">
				<Note
					text={attr.descriptionLg1}
					title={D.descriptionTitle}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
					context="operations"
				/>
				{secondLang && (
					<Note
						text={attr.descriptionLg2}
						title={D.descriptionTitle}
						lang={lg2}
						alone={false}
						allowEmpty={true}
						context="operations"
					/>
				)}
			</div>
			<div className="row">
				<Note
					text={
						<a href={attr.url} rel="noopener noreferrer" target="_blank">
							{attr.url}
						</a>
					}
					title={D.titleLink}
					lang={lg1}
					alone={true}
					allowEmpty={true}
					context="operations"
				/>
			</div>
		</React.Fragment>
	);
}

OperationsDocumentationVisualization.propTypes = {
	attr: PropTypes.object.isRequired,
};

export default OperationsDocumentationVisualization;
