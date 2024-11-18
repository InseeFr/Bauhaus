import { DisseminationStatusVisualisation } from '@components/dissemination-status/disseminationStatus';
import { Row } from '@components/layout';
import { Note } from '@components/note';

import { D1 } from '../../deprecated-locales';
import { arrayToString } from '../../utils/array-utils';
import { stringToDate } from '../../utils/date-utils';
import { useLocales } from '../../utils/hooks/useLocales';

function ConceptGeneral({ attr, secondLang }) {
	const { lg1, lg2 } = useLocales();
	let mapping = {
		id: D1.identifiantTitle,
	};
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
		<Row>
			<Note
				text={
					<ul>
						{Object.keys(mapping).map((fieldName) => {
							if (Object.hasOwn(attr, fieldName)) {
								if (fieldName === 'altLabelLg2' && !secondLang) {
									return null;
								}
								if (fieldName.includes('altLabel')) {
									return (
										<li key={fieldName}>
											{`${mapping[fieldName]} : ${arrayToString(
												attr[fieldName],
											)}`}
										</li>
									);
								}
								if (['created', 'modified'].includes(fieldName)) {
									if (!attr[fieldName]) {
										return null;
									}
									return (
										<li key={fieldName}>
											{`${mapping[fieldName]} : ${stringToDate(
												attr[fieldName],
											)}`}
										</li>
									);
								}
								if (['valid'].includes(fieldName)) {
									return (
										<li key={fieldName}>
											{`${mapping[fieldName]} : ${stringToDate(
												attr[fieldName],
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
											<DisseminationStatusVisualisation
												disseminationStatus={attr[fieldName]}
											/>
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
		</Row>
	);
}

export default ConceptGeneral;
