import { D1, D2 } from '../../deprecated-locales';
import { SearchableList } from '../../components';
import { Note } from '../../components/note';

const Members = ({ members, classificationId, secondLang }) => {
	const membersLg1 = members.map(({ id, labelLg1 }) => ({
		id,
		label: `${id} - ${labelLg1}`,
	}));
	let membersLg2 = [];
	if (secondLang && members[0].labelLg2 !== undefined) {
		membersLg2 = members.map(({ id, labelLg2 }) => ({
			id,
			label: `${id} - ${labelLg2}`,
		}));
	}
	return (
		<div className="row text-center">
			<Note
				text={
					<SearchableList
						items={membersLg1}
						childPath={`classifications/classification/${classificationId}/item`}
					/>
				}
				title={D1.childrenClassificationItems}
				alone={!secondLang}
				allowEmpty={true}
			/>
			{secondLang && (
				<Note
					text={
						<SearchableList
							items={membersLg2}
							childPath={`classifications/classification/${classificationId}/item`}
							col={12}
							colOff={0}
						/>
					}
					title={D2.childrenClassificationItems}
					alone={!secondLang}
					allowEmpty={true}
				/>
			)}
		</div>
	);
};

export default Members;
