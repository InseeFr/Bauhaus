import React from 'react';
import { Link } from 'react-router-dom';
import D from 'js/i18n';

export const generalFields = (correspondence, secondLang) => {
	let mapping = {
		firstClassLabelLg1: D.sourceClassificationTitle,
		secondClassLabelLg1: D.targetClassificationTitle,
	};
	const content = Object.keys(mapping).map(fieldName => {
		if (fieldName === 'firstClassLabelLg1' && correspondence[fieldName]) {
			return (
				<li key={fieldName}>
					{mapping[fieldName]} :{' '}
					<Link
						to={`/classifications/classification/${
							correspondence.idFirstClass
						}`}
					>
						{correspondence.firstClassLabelLg1}
					</Link>
					{secondLang &&
						correspondence.firstClasslabelLg2 && (
							<span>
								{' ('}
								<Link
									to={`/classifications/classification/${
										correspondence.idFirstClass
									}`}
								>
									{correspondence.firstClasslabelLg2}
								</Link>
								{')'}
							</span>
						)}
				</li>
			);
		}
		if (fieldName === 'secondClassLabelLg1' && correspondence[fieldName]) {
			return (
				<li key={fieldName}>
					{mapping[fieldName]} :{' '}
					<Link
						to={`/classifications/classification/${
							correspondence.idSecondClass
						}`}
					>
						{correspondence.secondClassLabelLg1}
					</Link>
					{secondLang &&
						correspondence.secondClasslabelLg2 && (
							<span>
								{' ('}
								<Link
									to={`/classifications/classification/${
										correspondence.idSecondClass
									}`}
								>
									{correspondence.secondClasslabelLg2}
								</Link>
								{')'}
							</span>
						)}
				</li>
			);
		} else return null;
	});

	return <ul>{content}</ul>;
};
