import { Link } from 'react-router-dom';

import D from '../../../deprecated-locales';

export const generalFields = (correspondence: any, secondLang: boolean) => {
	const mapping = {
		firstClassLabelLg1: D.sourceClassificationTitle,
		secondClassLabelLg1: D.targetClassificationTitle,
	};
	const content = Object.keys(mapping).map((fieldName) => {
		const {
			firstClassLabelLg1,
			firstClassLabelLg2,
			secondClassLabelLg1,
			secondClassLabelLg2,
		} = correspondence;
		if (fieldName === 'firstClassLabelLg1' && correspondence[fieldName]) {
			return (
				<li key={fieldName}>
					{mapping[fieldName]} :{' '}
					<Link
						to={`/classifications/classification/${correspondence.idFirstClass}`}
					>
						{secondLang ? firstClassLabelLg2 : firstClassLabelLg1}
					</Link>
				</li>
			);
		}
		if (fieldName === 'secondClassLabelLg1' && correspondence[fieldName]) {
			return (
				<li key={fieldName}>
					{mapping[fieldName]} :{' '}
					<Link
						to={`/classifications/classification/${correspondence.idSecondClass}`}
					>
						{secondLang ? secondClassLabelLg2 : secondClassLabelLg1}
					</Link>
				</li>
			);
		} else return null;
	});

	return <ul>{content}</ul>;
};
