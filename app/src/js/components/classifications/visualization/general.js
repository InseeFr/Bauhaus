import React from 'react';
import { Link } from 'react-router-dom';
import D from 'js/i18n';
import { Note }  from 'bauhaus-library';
import { stringToDate } from 'js/utils/moment';
import { DSURLToLabel } from 'js/utils/dissemination-status-convertor';

export default ({ general, secondLang, langs }) => {
	const { lg1, lg2 } = langs;
	let mapping = {};
	mapping = {
		...mapping,
		seriesLg1: D.motherSeries,
		afterLg1: D.classificationsAfterTitle,
		beforeLg1: D.classificationsBeforeTitle,
		variantLg1: D.classificationsVariantTitle,
	};
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
	mapping = {
		...mapping,
		issued: D.issuedDateTitle,
		valid: D.validDateTitle,
		lastRefreshedOn: D.lastRefreshedOnDateTitle,
		creator: D.creatorTitle,
		contributor: D.contributorTitle,
		disseminationStatus: D.disseminationStatusTitle,
		rights: D.rightsTitle,
		additionalMaterial: D.additionalMaterialTitle,
		legalMaterial: D.legalMaterialTitle,
		homepage: D.homepageTitle,
	};
	return (
		<div className="row">
			<Note
				title={D.globalInformationsTitle}
				alone={true}
				text={
					<ul>
						{Object.keys(mapping).map(fieldName => {
							if (general.hasOwnProperty(fieldName) && general[fieldName]) {
								if (fieldName === 'seriesLg1') {
									return (
										<li key={fieldName}>
											{mapping[fieldName]} :{' '}
											<Link to={`/classifications/series/${general.idSeries}`}>
												{general[fieldName]}
											</Link>
											{secondLang && general.seriesLg2 && (
												<span>
													{' ('}
													<Link
														to={`/classifications/series/${general.idSeries}`}
													>
														{general.seriesLg2}
													</Link>
													{')'}
												</span>
											)}
										</li>
									);
								}
								if (fieldName === 'afterLg1') {
									return (
										<li key={fieldName}>
											{mapping[fieldName]} :{' '}
											<Link
												to={`/classifications/classification/${general.idAfter}`}
											>
												{general[fieldName]}
											</Link>
											{secondLang && general.afterLg2 && (
												<span>
													{' ('}
													<Link
														to={`/classifications/classification/${general.idAfter}`}
													>
														{general.afterLg2}
													</Link>
													{')'}
												</span>
											)}
										</li>
									);
								}
								if (fieldName === 'beforeLg1') {
									return (
										<li key={fieldName}>
											{mapping[fieldName]} :{' '}
											<Link
												to={`/classifications/classification/${general.idBefore}`}
											>
												{general[fieldName]}
											</Link>
											{secondLang && general.beforeLg2 && (
												<span>
													{' ('}
													<Link
														to={`/classifications/classification/${general.idBefore}`}
													>
														{general.beforeLg2}
													</Link>
													{')'}
												</span>
											)}
										</li>
									);
								}
								if (fieldName === 'variantLg1') {
									return (
										<li key={fieldName}>
											{mapping[fieldName]} :{' '}
											<Link
												to={`/classifications/classification/${general.idVariant}`}
											>
												{general[fieldName]}
											</Link>
											{secondLang && general.variantLg2 && (
												<span>
													{' ('}
													<Link
														to={`/classifications/classification/${general.idVariant}`}
													>
														{general.variantLg2}
													</Link>
													{')'}
												</span>
											)}
										</li>
									);
								}
								if (
									['additionalMaterial', 'legalMaterial'].includes(fieldName)
								) {
									return (
										<li key={fieldName}>
											{`${mapping[fieldName]} : `}
											<a
												href={general[fieldName]}
												target="_blank"
												rel="noopener noreferrer"
											>{`${general[fieldName]}`}</a>
										</li>
									);
								}
								if (fieldName === 'disseminationStatus') {
									return (
										<li key={fieldName}>
											{`${mapping[fieldName]} : ${DSURLToLabel(
												general[fieldName]
											)}`}
										</li>
									);
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
								}
								if (
									['issued', 'valid', 'lastRefreshedOn'].includes(fieldName)
								) {
									return (
										<li key={fieldName}>
											{`${mapping[fieldName]} : ${stringToDate(
												general[fieldName]
											)}`}
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
				}
			></Note>
		</div>
	);
};
