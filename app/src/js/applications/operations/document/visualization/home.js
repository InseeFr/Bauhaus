import { Note } from '@inseefr/wilco';
import { D1, D2 } from 'js/i18n';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { isDocument, isLink } from '../utils';
import { API } from 'bauhaus-utilities';
import RelationsView from '../../shared/relations';

function formatSims(sims){
	const simsObject = sims.reduce((acc, s) => {
		if(acc[s.id]){
			return {
				...acc,
				[s.id]: {
					...acc[s.id],
					rubrics: [...acc[s.id].rubrics, s.simsRubricId]
				}
			}
		} else {
			return {
				...acc,
				[s.id]: {
					...s,
					rubrics: [s.simsRubricId]
				}
			}
		}
	}, {})

	return Object.values(simsObject).map(s => {
		return {
			...s,
			labelLg1: s.labelLg1 + ` (${s.rubrics?.join(', ')})`,
			labelLg2: s.labelLg2 + ` (${s.rubrics?.join(', ')})`,
		}
	})
}
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
	langOptions
}) {
	const sims = formatSims(attr.sims);
	const [baseURI, setBaseURI] = useState('');
	useEffect(() => {
		API.getBaseURI().then((uri) => setBaseURI(uri));
	});
	return (
		<React.Fragment>
			<div className="row">
				<Note
					text={attr.descriptionLg1}
					title={D1.descriptionTitle}
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
						text={
							attr.updatedDate &&
							new Date(attr.updatedDate).toLocaleDateString()
						}
						title={D1.titleUpdatedDate}
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
								href={`${baseURI}/documents/document/${id}/file`}
								rel="noopener noreferrer"
								target="_blank"
							>
								{attr.labelLg1}
							</a>
						}
						title={D1.titleDocument}
						lang={lg1}
						alone={true}
						allowEmpty={true}
					/>
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
						title={D1.titleLink}
						lang={lg1}
						alone={true}
						allowEmpty={true}
					/>
				</div>
			)}
			<div className="row">
				<Note
					text={
						langOptions?.codes?.find(option => option.code === attr.lang)?.labelLg1
					}
					title={D1.langTitle}
					lang={lg1}
					alone={true}
					allowEmpty={true}
				/>
			</div>
			<RelationsView
				children={sims}
				childrenTitle={'linkedSims'}
				childrenPath="sims"
				title={'linksTitle'}
				langs={{ lg1, lg2 }}
				secondLang={secondLang}
			/>
		</React.Fragment>
	);
}

OperationsDocumentationVisualization.propTypes = {
	attr: PropTypes.object.isRequired,
};

export default OperationsDocumentationVisualization;
