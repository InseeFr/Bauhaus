import { Link } from 'react-router-dom';
import { Note } from '@inseefr/wilco';
import { D1, D2 } from '../../../../new-architecture/modules-concepts/i18n';
import { ArrayUtils } from '../../../../utils';
import { Row } from '../../../../new-architecture/components';

const sortByLabelLg1 = ArrayUtils.sortArray('prefLabelLg1');
const renderMemberList = (sortedMembers, label) =>
	sortedMembers.map(({ id, [label]: prefLabel }) => (
		<li key={id}>
			<Link to={`/concept/${id}`}>{prefLabel}</Link>
		</li>
	));

function CollectionMembers({ members, secondLang }) {
	const sortedMembers = sortByLabelLg1(members);

	const memberListLg1 = renderMemberList(sortedMembers, 'prefLabelLg1');
	const memberListLg2 = renderMemberList(sortedMembers, 'prefLabelLg2');

	return (
		<Row>
			<Note
				text={memberListLg1}
				title={D1.collectionMembersPanelTitle(memberListLg1.length)}
				alone={!secondLang}
			/>
			{secondLang && (
				<Note
					text={memberListLg2}
					title={D2.collectionMembersPanelTitle(memberListLg2.length)}
					alone={false}
				/>
			)}
		</Row>
	);
}

export default CollectionMembers;
