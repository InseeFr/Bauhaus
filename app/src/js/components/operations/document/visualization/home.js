import { Note } from 'js/components/shared/note/note';
import D from 'js/i18n';
import PropTypes from 'prop-types';
import React from 'react';
import { isDocument, isLink } from '../utils';

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
				/>
				{secondLang && (
					<Note
						text={attr.descriptionLg2}
						title={D.descriptionTitle}
						lang={lg2}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</div>
			{isDocument(attr) && (
				<div className="row">
					<Note
						text={new Date(attr.updatedDate).toLocaleDateString()}
						title={D.titleUpdatedDate}
						lang={lg1}
						alone={true}
						allowEmpty={true}
					/>
				</div>
			)}
			{isDocument(attr) && (
				<div className="row">
					<Note
						text={
							<a href={attr.url} rel="noopener noreferrer" target="_blank">
								{attr.labelLg1}
							</a>
						}
						title={D.titleLink}
						lang={lg1}
						alone={!secondLang}
						allowEmpty={true}
					/>
					{secondLang && (
						<Note
							text={
								<a href={attr.url} rel="noopener noreferrer" target="_blank">
									{attr.labelLg2}
								</a>
							}
							title={D.descriptionTitle}
							lang={lg2}
							alone={false}
							allowEmpty={true}
						/>
					)}
				</div>
			)}
			{isLink(attr) && (
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
					/>
				</div>
			)}
		</React.Fragment>
	);
}

OperationsDocumentationVisualization.propTypes = {
	attr: PropTypes.object.isRequired,
};

export default OperationsDocumentationVisualization;
