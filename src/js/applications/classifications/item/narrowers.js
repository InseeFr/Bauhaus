import { Link } from 'react-router-dom';
import { Note } from '@inseefr/wilco';
import { D1, D2 } from '../../../i18n';
import { Row } from '../../../new-architecture/components';

const Narrowers = ({ narrowers, classificationId, secondLang }) => {
	if (!narrowers || narrowers?.length === 0) {
		return null;
	}

	const narrowersLg1 = narrowers?.map((n, i) => (
		<li key={i}>
			<Link
				to={`/classifications/classification/${classificationId}/item/${n.id}`}
			>
				{`${n.id} - ${n.labelLg1}`}
			</Link>
		</li>
	));
	let narrowersLg2 = [];
	if (secondLang)
		narrowersLg2 = narrowers?.map((n, i) =>
			n.labelLg2 ? (
				<li key={i}>
					<Link
						to={`/classifications/classification/${classificationId}/item/${n.id}`}
					>
						{`${n.id} - ${n.labelLg2}`}
					</Link>
				</li>
			) : null
		);
	const isMembersLg2 = narrowersLg2.filter((m) => m !== null).length !== 0;
	return (
		<Row>
			<Note
				text={<ul>{narrowersLg1}</ul>}
				title={D1.classificationsNarrowerItems}
				alone={!(secondLang && isMembersLg2)}
				allowEmpty={true}
			/>
			{secondLang && isMembersLg2 && (
				<Note
					text={<ul>{narrowersLg2}</ul>}
					title={D2.classificationsNarrowerItems}
					alone={false}
					allowEmpty={true}
				/>
			)}
		</Row>
	);
};

export default Narrowers;
