import { D1, D2 } from '../../../deprecated-locales';
import { CreationUpdateItems } from '../../../components';
import { Note } from '../../../components/note';

function CollectionGeneral({ attr, secondLang, langs }) {
	const mapping = {
		creator: D1.creatorTitle,
		contributor: D1.contributorTitle,
		isValidated: D1.isCollectionValidTitle,
	};
	const { lg1, lg2 } = langs;
	return (
		<>
			<div className="row">
				<Note
					title={D1.globalInformationsTitle}
					alone={true}
					text={
						<ul>
							<CreationUpdateItems
								creation={attr.created}
								update={attr.modified}
							/>
							{Object.keys(mapping).map((fieldName) => {
								if (attr.hasOwnProperty(fieldName) && attr[fieldName] !== '') {
									if (fieldName === 'isValidated') {
										return (
											<li key={fieldName}>{`${mapping[fieldName]} : ${
												attr[fieldName] === 'false'
													? D1.collectionStatusProvisional
													: D1.collectionStatusValid
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
						title={D1.descriptionTitle}
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
