import React from 'react';
import { Link } from 'react-router-dom';
import Note from 'js/components/shared/note';
import D, { D2 } from 'js/i18n';
import { sortArray } from 'js/utils/array-utils';

const sortByLabelLg1 = sortArray('prefLabelLg1');
const sortByLabelLg2 = sortArray('prefLabelLg2');

function CollectionMembers({ members, secondLang, langs }) {
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
	const { lg1, lg2 } = langs;
	return (
		<div className="row">
			<Note
				text={memberListLg1}
				title={D.collectionMembersPanelTitle}
				lang={lg1}
				alone={!secondLang}
			/>
			{secondLang && (
				<Note
					text={memberListLg2}
					title={D2.collectionMembersPanelTitle}
					lang={lg2}
					alone={false}
				/>
			)}
		</div>
	);
}

export default CollectionMembers;
