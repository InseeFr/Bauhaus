import { D1 } from '../../i18n/build-dictionary';
import { Note } from '../../../components/note';
import { useOrganizations } from '../../../utils/hooks/organizations';

const PublishersView = ({ publishers, lg1 }) => {
	const publishersIdArray = Array.isArray(publishers)
		? publishers
		: [publishers];
	const { data: organisations } = useOrganizations();
	const publishersArray = publishersIdArray.map(
		({ id }) => organisations.find((orga) => orga.id === id) || {},
	);
	return (
		<Note
			text={
				publishersArray.length === 1 ? (
					<p>{publishersArray[0].label}</p>
				) : (
					<ul>
						{publishersArray.map(({ label }, index) => (
							<li key={index}>{label}</li>
						))}
					</ul>
				)
			}
			title={D1.organisation}
			lang={lg1}
			alone={true}
			allowEmpty={true}
		/>
	);
};

export default PublishersView;
