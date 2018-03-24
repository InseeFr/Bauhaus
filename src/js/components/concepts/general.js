import React from 'react';
import D from 'js/i18n';
import Panel from 'js/components/shared/panel';
import { dateTimeToDateString, DSURLToLabel } from 'js/utils/utils';

function ConceptGeneral({ attr, secondLang, langs }) {
	const { lg1, lg2 } = langs;
	let mapping = {};
	if (attr.altLabelLg1) {
		mapping = {
			...mapping,
			altLabelLg1: `${D.altLabelTitle} (${lg1})`,
		};
	}
	if (attr.altLabelLg2) {
		mapping = {
			...mapping,
			altLabelLg2: `${D.altLabelTitle} (${lg2})`,
		};
	}
	mapping = {
		...mapping,
		created: D.createdDateTitle,
		modified: D.modifiedDateTitle,
	};
	if (attr.valid) {
		mapping = {
			...mapping,
			valid: D.validDateTitle,
		};
	}
	mapping = {
		...mapping,
		conceptVersion: D.conceptVersionTitle,
		creator: D.creatorTitle,
		contributor: D.contributorTitle,
		disseminationStatus: D.disseminationStatusTitle,
		isValidated: D.isConceptValidTitle,
	};
	if (attr.additionalMaterial) {
		mapping = {
			...mapping,
			additionalMaterial: D.additionalMaterialTitle,
		};
	}

	return (
		<div className="row">
			<div className="col-md-12">
				<Panel title={D.globalInformationsTitle}>
					<ul>
						{Object.keys(mapping).map(fieldName => {
							if (attr.hasOwnProperty(fieldName)) {
								if (fieldName === 'altLabelLg2' && !secondLang) {
									return null;
								}
								if (fieldName.includes('altLabel')) {
									return (
										<li key={fieldName}>
											{`${mapping[fieldName]} : ${attr[fieldName]
												.split(' || ')
												.join(' - ')}`}
										</li>
									);
								}
								if (
									fieldName === 'created' ||
									fieldName === 'modified' ||
									fieldName === 'valid'
								) {
									return (
										<li key={fieldName}>
											{`${mapping[fieldName]} : ${dateTimeToDateString(
												attr[fieldName]
											)}`}
										</li>
									);
								}
								if (fieldName === 'additionalMaterial') {
									return (
										<li key={fieldName}>
											{`${mapping[fieldName]} : `}
											<a href={attr[fieldName]} target="_blank">{`${
												attr[fieldName]
											}`}</a>
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
								} else {
									return (
										<li key={fieldName}>{`${mapping[fieldName]} : ${
											attr[fieldName]
										}`}</li>
									);
								}
							} else return null;
						})}
					</ul>
				</Panel>
			</div>
		</div>
	);
}

export default ConceptGeneral;
