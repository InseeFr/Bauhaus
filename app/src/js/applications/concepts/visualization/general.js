import React from 'react';
import { D1 } from 'js/i18n';
import { Note } from 'bauhaus-library';
import { arrayToString } from 'js/utils/array-utils';
import { DSURLToLabel } from 'bauhaus-library/src/utils/dissemination-status-convertor';
import { stringToDate } from 'js/utils/moment';

function ConceptGeneral({ attr, secondLang, langs }) {
	const { lg1, lg2 } = langs;
	let mapping = {};
	if (attr.altLabelLg1 && attr.altLabelLg1.length !== 0) {
		mapping = {
			...mapping,
			altLabelLg1: `${D1.altLabelTitle} (${lg1})`,
		};
	}
	if (attr.altLabelLg2 && attr.altLabelLg2.length !== 0) {
		mapping = {
			...mapping,
			altLabelLg2: `${D1.altLabelTitle} (${lg2})`,
		};
	}
	mapping = {
		...mapping,
		created: D1.createdDateTitle,
		modified: D1.modifiedDateTitle,
	};
	if (attr.valid) {
		mapping = {
			...mapping,
			valid: D1.validDateTitle,
		};
	}
	mapping = {
		...mapping,
		conceptVersion: D1.conceptVersionTitle,
		creator: D1.creatorTitle,
		contributor: D1.contributorTitle,
		disseminationStatus: D1.disseminationStatusTitle,
		isValidated: D1.isConceptValidTitle,
	};
	if (attr.additionalMaterial) {
		mapping = {
			...mapping,
			additionalMaterial: D1.additionalMaterialTitle,
		};
	}

	return (
		<div className="row">
			<Note
				text={
					<ul>
						{Object.keys(mapping).map(fieldName => {
							if (attr.hasOwnProperty(fieldName)) {
								if (fieldName === 'altLabelLg2' && !secondLang) {
									return null;
								}
								if (fieldName.includes('altLabel')) {
									return (
										<li key={fieldName}>
											{`${mapping[fieldName]} : ${arrayToString(
												attr[fieldName]
											)}`}
										</li>
									);
								}
								if (['created', 'modified', 'valid'].includes(fieldName)) {
									return (
										<li key={fieldName}>
											{`${mapping[fieldName]} : ${stringToDate(
												attr[fieldName]
											)}`}
										</li>
									);
								}
								if (fieldName === 'additionalMaterial') {
									return (
										<li key={fieldName}>
											{`${mapping[fieldName]} : `}
											<a
												href={attr[fieldName]}
												target="_blank"
												rel="noopener noreferrer"
											>{`${attr[fieldName]}`}</a>
										</li>
									);
								}
								if (fieldName === 'disseminationStatus') {
									return (
										<li key={fieldName}>
											{`${mapping[fieldName]} : ${DSURLToLabel(
												attr[fieldName]
											)}`}
										</li>
									);
								} else if (fieldName === 'isValidated') {
									return (
										<li key={fieldName}>{`${mapping[fieldName]} : ${
											attr[fieldName] === 'true'
												? D1.conceptStatusValid
												: D1.conceptStatusProvisional
										}`}</li>
									);
								} else {
									return (
										<li
											key={fieldName}
										>{`${mapping[fieldName]} : ${attr[fieldName]}`}</li>
									);
								}
							} else return null;
						})}
					</ul>
				}
				title={D1.globalInformationsTitle}
				alone={true}
			/>
		</div>
	);
}

export default ConceptGeneral;
