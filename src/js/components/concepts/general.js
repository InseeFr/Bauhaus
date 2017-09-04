import React from 'react';
import { dictionary } from 'js/utils/dictionary';
import Panel from 'js/components/shared/panel';
import { dateTimeToDateString } from 'js/utils/utils';

function ConceptGeneral({ attr, english }) {
	var mapping = {};
	if (attr.altLabelLg1) {
		mapping = {
			...mapping,
			altLabelLg1: dictionary.concept.altLabel + ' (fr)',
		};
	}
	if (attr.altLabelLg2) {
		mapping = {
			...mapping,
			altLabelLg2: dictionary.concept.altLabel + ' (en)',
		};
	}
	mapping = {
		...mapping,
		created: dictionary.concept.created,
		modified: dictionary.concept.modified,
	};
	if (attr.valid) {
		mapping = {
			...mapping,
			valid: dictionary.concept.valid,
		};
	}
	mapping = {
		...mapping,
		conceptVersion: dictionary.concept.conceptVersion,
		creator: dictionary.concept.creator,
		contributor: dictionary.concept.contributor,
		disseminationStatus: dictionary.concept.disseminationStatus.title,

		isValidated: dictionary.concept.isValidated,
	};
	if (attr.additionalMaterial) {
		mapping = {
			...mapping,
			additionalMaterial: dictionary.concept.additionalMaterial,
		};
	}
	mapping = {
		...mapping,
		isValidated: dictionary.concept.isValidated,
	};

	return (
		<div className="row">
			<div className="col-md-12">
				<Panel title={dictionary.concept.general}>
					<ul>
						{Object.keys(mapping).map(fieldName => {
							if (attr.hasOwnProperty(fieldName)) {
								if (fieldName === 'altLabelLg2' && !english) {
									return null;
								}
								if (
									fieldName === 'created' ||
									fieldName === 'modified' ||
									fieldName === 'valid'
								) {
									return (
										<li key={fieldName}>{`${mapping[
											fieldName
										]} : ${dateTimeToDateString(attr[fieldName])}`}</li>
									);
								}
								if (fieldName === 'additionalMaterial') {
									return (
										<li key={fieldName}>
											{`${mapping[fieldName]} : `}
											<a href={attr[fieldName]} target="_blank">{`${attr[
												fieldName
											]}`}</a>
										</li>
									);
								} else {
									return (
										<li key={fieldName}>{`${mapping[fieldName]} : ${attr[
											fieldName
										]}`}</li>
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
