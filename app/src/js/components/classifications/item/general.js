import React from 'react';
import { Link } from 'react-router-dom';
import D from 'js/i18n';
import Panel from 'js/components/shared/panel';

export default ({ general, classificationId, itemId, secondLang }) => {
	const mapping = {
		broaderLg1: D.classificationsBroaderLevel,
		itemId: D.classificationsNotationTitle,
		altLabels: length => D.classificationItemAltLabels(length),
		isValidated: D.isClassificationItemValidTitle,
		conceptVersion: D.classificationConceptVersionTitle,
	};
	return (
		<div className="row">
			<div className="col-md-12">
				<Panel title={D.globalInformationsTitle} context="classifications">
					<ul>
						{Object.keys(mapping).map(fieldName => {
							if (general.hasOwnProperty(fieldName) && general[fieldName]) {
								if (fieldName === 'broaderLg1') {
									return (
										<li key={fieldName}>
											{mapping[fieldName]} :{' '}
											<Link
												to={`/classifications/classification/${classificationId}/item/${
													general.idBroader
												}`}
											>
												{general.idBroader} - {general[fieldName]}
											</Link>
											{secondLang &&
												general.broaderLg2 && (
													<span>
														{' ('}
														<Link
															to={`/classifications/classification/${classificationId}/item/${
																general.idBroader
															}`}
														>
															{general.idBroader} - {general.broaderLg2}
														</Link>
														{')'}
													</span>
												)}
										</li>
									);
								}
								if (fieldName === 'altLabels') {
									return general.altLabels.map(
										({ length, shortLabelLg1, shortLabelLg2 }) => (
											<li key={`${fieldName}-${length}`}>
												{`${mapping[fieldName](length)} : ${shortLabelLg1} ${
													shortLabelLg2
														? `(
													${shortLabelLg2}
												)`
														: ''
												}`}
											</li>
										)
									);
								}
								if (fieldName === 'isValidated') {
									return (
										<li key={fieldName}>{`${
											mapping[fieldName]
										} : ${D.classificationItemIsValidated(
											general[fieldName]
										)}`}</li>
									);
								} else {
									return (
										<li key={fieldName}>{`${mapping[fieldName]} : ${
											general[fieldName]
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
};
