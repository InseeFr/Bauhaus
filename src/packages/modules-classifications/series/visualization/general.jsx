import { Link } from 'react-router-dom';

import { Row } from '@components/layout';
import { Note } from '@components/note';

import D from '../../../deprecated-locales';

const General = ({ general, secondLang }) => {
	let mapping = {};
	if (general.familyLg1) {
		mapping = {
			...mapping,
			familyLg1: `${D.motherFamily}`,
		};
	}
	if (general.altLabelLg1) {
		mapping = {
			...mapping,
			altLabelLg1: `${D.altLabelTitle}`,
		};
	}
	if (general.altLabelLg2) {
		mapping = {
			...mapping,
			altLabelLg2: `${D.altLabelTitle}`,
		};
	}
	if (general.subject) {
		mapping = {
			...mapping,
			subject: `${D.classificationsSubjectTitle}`,
		};
	}
	if (general.covers) {
		mapping = {
			...mapping,
			covers: `${D.classificationsCoversTitle}`,
		};
	}
	if (general.publisher) {
		mapping = {
			...mapping,
			publisher: `${D.classificationsPublisherTitle}`,
		};
	}

	const lis = Object.keys(mapping).map((fieldName) => {
		if (Object.hasOwn(general, fieldName)) {
			if (fieldName === 'familyLg1') {
				return (
					<li key={fieldName}>
						{mapping[fieldName]} :{' '}
						<Link to={`/classifications/family/${general.idFamily}`}>
							{general[fieldName]}
						</Link>
						{secondLang && general.familyLg2 && (
							<span>
								{' ('}
								<Link to={`/classifications/family/${general.idFamily}`}>
									{general.familyLg2}
								</Link>
								{')'}
							</span>
						)}
					</li>
				);
			}
			if (fieldName === 'altLabelLg2' && !secondLang) {
				return null;
			}

			if (fieldName.includes('altLabel')) {
				return (
					<li key={fieldName}>
						{`${mapping[fieldName]} : ${general[fieldName]
							.split(' || ')
							.join(' - ')}`}
					</li>
				);
			} else {
				return (
					<li
						key={fieldName}
					>{`${mapping[fieldName]} : ${general[fieldName]}`}</li>
				);
			}
		} else return null;
	});
	return (
		<Row>
			<Note
				title={D.globalInformationsTitle}
				alone={true}
				text={<ul>{lis}</ul>}
			></Note>
		</Row>
	);
};

export default General;
