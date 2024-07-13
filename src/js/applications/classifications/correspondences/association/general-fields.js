import { Link } from 'react-router-dom';
import D from '../../../../i18n';

export const generalFields = (association, secondLang) => {
	let mapping = {
		sourceItemLabelLg1: D.sourceItemTitle,
		targetItemLabelLg1: D.targetItemTitle,
	};
	const {
		sourceClassId,
		targetClassId,
		sourceItemId,
		targetItemId,
		sourceItemLabelLg1,
		sourceItemLabelLg2,
		targetItemLabelLg1,
		targetItemLabelLg2,
		sourceClassAltLabelLg1,
		sourceClassAltLabelLg2,
		targetClassAltLabelLg1,
		targetClassAltLabelLg2,
	} = association;
	const content = Object.keys(mapping).map((fieldName) => {
		if (fieldName === 'sourceItemLabelLg1' && association[fieldName]) {
			return (
				<li key={fieldName}>
					{mapping[fieldName]} :{' '}
					<Link
						to={`/classifications/classification/${sourceClassId}/item/${sourceItemId}`}
					>
						{`${sourceItemId} - `}
						{!secondLang ? sourceItemLabelLg1 : sourceItemLabelLg2}
					</Link>
					<Link to={`/classifications/classification/${sourceClassId}`}>
						{!secondLang
							? sourceClassAltLabelLg1 && ` (${sourceClassAltLabelLg1})`
							: sourceClassAltLabelLg2 && ` (${sourceClassAltLabelLg2})`}
					</Link>
				</li>
			);
		}
		if (fieldName === 'targetItemLabelLg1' && association[fieldName]) {
			return (
				<li key={fieldName}>
					{mapping[fieldName]} :{' '}
					<Link
						to={`/classifications/classification/${targetClassId}/item/${targetItemId}`}
					>
						{`${targetItemId} - `}
						{!secondLang ? targetItemLabelLg1 : targetItemLabelLg2}
					</Link>
					<Link to={`/classifications/classification/${targetClassId}`}>
						{!secondLang
							? targetClassAltLabelLg1 && ` (${targetClassAltLabelLg1})`
							: targetClassAltLabelLg2 && ` (${targetClassAltLabelLg2})`}
					</Link>
				</li>
			);
		} else return null;
	});

	return <ul>{content}</ul>;
};
