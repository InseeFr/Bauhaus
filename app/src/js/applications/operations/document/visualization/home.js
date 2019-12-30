import { Note } from 'bauhaus-library';
import D, { D2 } from 'js/i18n';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { isDocument, isLink } from '../utils';
import { getBaseURI } from 'js/remote-api/build-api';
/**
 * @typedef OperationsDocumentationVisualizationProps
 * @property {any} attr
 * @property {boolean} secondLang
 * @property {{ lg1: string, lg2: string }} langs
 *
 * @param {OperationsDocumentationVisualizationProps} props
 */
function OperationsDocumentationVisualization({
	id,
	attr,
	secondLang,
	langs: { lg1, lg2 },
}) {
	const [baseURI, setBaseURI] = useState('');
	useEffect(() => {
		getBaseURI().then(uri => setBaseURI(uri));
	});
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
						title={D2.descriptionTitle}
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
							<a
								href={`${baseURI}/documents/document/${id}`}
								rel="noopener noreferrer"
								target="_blank"
							>
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
							title={D2.titleLink}
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
