import React from 'react';
import D, { D2 } from 'js/i18n';
import { Note } from 'bauhaus-library';
import { stringToDate } from 'js/utils/moment';

function CollectionGeneral({ attr, secondLang, langs }) {
	const mapping = {
		created: D.createdDateTitle,
		modified: D.modifiedDateTitle,
		creator: D.creatorTitle,
		contributor: D.contributorTitle,
		isValidated: D.isCollectionValidTitle,
	};
	const { lg1, lg2 } = langs;
	return (
		<>
			<div className="row">
				<Note
					title={D.globalInformationsTitle}
					alone={true}
					text={
						<ul>
							{Object.keys(mapping).map(fieldName => {
								if (attr.hasOwnProperty(fieldName) && attr[fieldName] !== '') {
									if (fieldName === 'created' || fieldName === 'modified') {
										return (
											<li key={fieldName}>{`${
												mapping[fieldName]
											} : ${stringToDate(attr[fieldName])}`}</li>
										);
									} else if (fieldName === 'isValidated') {
										return (
											<li key={fieldName}>{`${mapping[fieldName]} : ${
												attr[fieldName] === 'false'
													? D.collectionStatusProvisional
													: D.collectionStatusValid
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
				/>
			</div>
			{attr.descriptionLg1 && (
				<div className="row">
					<Note
						text={attr.descriptionLg1}
						title={D.descriptionTitle}
						lang={lg1}
						alone={!secondLang}
					/>
					{secondLang && (
						<Note
							text={attr.descriptionLg2}
							title={D2.descriptionTitle}
							lang={lg2}
							alone={false}
						/>
					)}
				</div>
			)}
		</>
	);
}

export default CollectionGeneral;
