import React from 'react';
import { Link } from 'react-router-dom';
import D from 'js/i18n';
import { Panel }  from '@inseefr/ui';

export default ({ general, secondLang, langs }) => {
	const { lg1, lg2 } = langs;
	let mapping = {};
	if (general.familyLg1) {
		mapping = {
			...mapping,
			familyLg1: `${D.motherFamily}`,
		};
	}
	if (general.altLabelLg1) {
		mapping = {
			...mapping,
			altLabelLg1: `${D.altLabelTitle} (${lg1})`,
		};
	}
	if (general.altLabelLg2) {
		mapping = {
			...mapping,
			altLabelLg2: `${D.altLabelTitle} (${lg2})`,
		};
	}
	if (general.subject) {
		mapping = {
			...mapping,
			subject: `${D.classificationsSubjectTitle}`,
		};
	}
	if (general.covers) {
		mapping = {
			...mapping,
			covers: `${D.classificationsCoversTitle}`,
		};
	}
	if (general.publisher) {
		mapping = {
			...mapping,
			publisher: `${D.classificationsPublisherTitle}`,
		};
	}

	return (
		<div className="row">
			<div className="col-md-12">
				<Panel title={D.globalInformationsTitle}>
					<ul>
						{Object.keys(mapping).map(fieldName => {
							if (general.hasOwnProperty(fieldName)) {
								if (fieldName === 'familyLg1') {
									return (
										<li key={fieldName}>
											{mapping[fieldName]} :{' '}
											<Link to={`/classifications/family/${general.idFamily}`}>
												{general[fieldName]}
											</Link>
											{secondLang && general.familyLg2 && (
												<span>
													{' ('}
													<Link
														to={`/classifications/family/${general.idFamily}`}
													>
														{general.familyLg2}
													</Link>
													{')'}
												</span>
											)}
										</li>
									);
								}
								if (fieldName === 'altLabelLg2' && !secondLang) {
									return null;
								}
								if (fieldName === 'altLabelLg2' && !secondLang) {
									return null;
								}
								if (fieldName.includes('altLabel')) {
									return (
										<li key={fieldName}>
											{`${mapping[fieldName]} : ${general[fieldName]
												.split(' || ')
												.join(' - ')}`}
										</li>
									);
								} else {
									return (
										<li
											key={fieldName}
										>{`${mapping[fieldName]} : ${general[fieldName]}`}</li>
									);
								}
							} else return null;
						})}
					</ul>
				</Panel>
			</div>
		</div>
	);
};
