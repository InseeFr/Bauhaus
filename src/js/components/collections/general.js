import React from 'react';
import { dictionary } from 'js/utils/dictionary';
import Panel from 'js/components/shared/panel';
import { Note } from 'js/components/shared/note';
import { dateTimeToDateString } from 'js/utils/utils';

function CollectionGeneral({ attr, english }) {
	const mapping = {
		created: dictionary.collection.created,
		modified: dictionary.collection.modified,
		creator: dictionary.collection.creator,
		contributor: dictionary.collection.contributor,
		isValidated: dictionary.collection.isValidated,
	};

	return (
		<div>
			<Panel title={dictionary.collection.general}>
				<ul>
					{Object.keys(mapping).map(fieldName => {
						if (attr.hasOwnProperty(fieldName)) {
							if (fieldName === 'created' || fieldName === 'modified') {
								return (
									<li key={fieldName}>{`${mapping[
										fieldName
									]} : ${dateTimeToDateString(attr[fieldName])}`}</li>
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
			{attr.descriptionLg1 &&
				<div className="row">
					<Note
						text={attr.descriptionLg1}
						title={dictionary.collection.description}
						lang="fr"
						alone={!english}
					/>
					{english &&
						<Note
							text={attr.descriptionLg2}
							title={dictionary.collection.description}
							lang="en"
							alone={false}
						/>}
				</div>}
		</div>
	);
}

export default CollectionGeneral;
