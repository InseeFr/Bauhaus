import React from 'react';
import { Link } from 'react-router-dom';
import D from 'js/i18n';
import Panel from 'js/components/shared/panel';

export default ({ general, classificationId, secondLang }) => {
	const mapping = {
		broaderLg1: D.classificationsBroaderLevel,
		narrowerLg1: D.classificationsNarrowerLevel,
		notation: D.classificationsNotationTitle,
		depth: D.classificationsDepthTitle,
		notationPattern: D.classificationsNotationPatternTitle,
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
											<Link to={`/classifications/series/${general.idBroader}`}>
												{general[fieldName]}
											</Link>
											{secondLang &&
												general.broaderLg2 && (
													<span>
														{' ('}
														<Link
															to={`/classifications/series/${
																general.idBroader
															}`}
														>
															{general.broaderLg2}
														</Link>
														{')'}
													</span>
												)}
										</li>
									);
								}
								if (fieldName === 'narrowerLg1') {
									return (
										<li key={fieldName}>
											{mapping[fieldName]} :{' '}
											<Link
												to={`/classifications/classification/${classificationId}/level/${
													general.idNarrower
												}`}
											>
												{general[fieldName]}
											</Link>
											{secondLang &&
												general.narrowerLg2 && (
													<span>
														{' ('}
														<Link
															to={`/classifications/classification/${classificationId}/level/${
																general.idNarrower
															}`}
														>
															{general.narrowerLg2}
														</Link>
														{')'}
													</span>
												)}
										</li>
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
