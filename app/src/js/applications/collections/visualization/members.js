import React from 'react';
import { Link } from 'react-router-dom';
import { Note } from '@inseefr/wilco';
import { D1, D2 } from 'js/i18n';
import { ArrayUtils, Row } from 'bauhaus-utilities';
import PropTypes from 'prop-types';

const sortByLabelLg1 = ArrayUtils.sortArray('prefLabelLg1');

function CollectionMembers({ members, secondLang, langs: { lg1, lg2 } }) {
	/**
	 * We sort the members by the labelLg1 property for the
	 * LG1 and LG2 lists
	 */
	const sortMembers = sortByLabelLg1(members);

	const memberListLg1 = sortMembers.map(item => (
		<li key={item.id}>
			<Link to={'/concept/' + item.id}>{item.prefLabelLg1}</Link>
		</li>
	));
	const memberListLg2 = sortMembers.map(item => (
		<li key={item.id}>
			<Link to={'/concept/' + item.id}>{item.prefLabelLg2}</Link>
		</li>
	));

	return (
		<Row>
			<Note
				text={memberListLg1}
				title={D1.collectionMembersPanelTitle}
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
		</Row>
	);
}
CollectionMembers.propTypes = {
	secondLang: PropTypes.bool,
	members: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string,
		prefLabelLg1: PropTypes.string.isRequired,
		prefLabelLg2: PropTypes.string
	})).isRequired,
	langs: PropTypes.shape({
		lg1: PropTypes.string.isRequired,
		lg2: PropTypes.string.isRequired
	}).isRequired
}
export default CollectionMembers;
