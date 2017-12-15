import React from 'react';
import { Link } from 'react-router-dom';
import { Note } from 'js/components/shared/note';
import { dictionary } from 'js/utils/dictionary';
import { sortArray } from 'js/utils/array-utils';

const sortByLabelLg1 = sortArray('prefLabelLg1');
const sortByLabelLg2 = sortArray('prefLabelLg2');

function CollectionMembers({ members, english }) {
	const memberListLg1 = sortByLabelLg1(members).map(item => (
		<li key={item.id}>
			<Link to={'/concept/' + item.id}>{item.prefLabelLg1}</Link>
		</li>
	));
	const memberListLg2 = sortByLabelLg2(members).map(item => (
		<li key={item.id}>
			<Link to={'/concept/' + item.id}>{item.prefLabelLg2}</Link>
		</li>
	));

	return (
		<div className="row">
			<Note
				text={memberListLg1}
				title={dictionary.collection.members}
				lang="fr"
				alone={!english}
			/>
			{english && (
				<Note
					text={memberListLg2}
					title={dictionary.collection.members}
					lang="en"
					alone={false}
				/>
			)}
		</div>
	);
}

export default CollectionMembers;
