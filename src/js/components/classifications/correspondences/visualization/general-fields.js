import React from 'react';
import { Link } from 'react-router-dom';
import D from 'js/i18n';

export const generalFields = (correspondence, secondLang) => {
	let mapping = {
		firstClasslabelLg1: D.sourceClassificationTitle,
		secondClasslabelLg1: D.targetClassificationTitle,
	};
	const content = Object.keys(mapping).map(fieldName => {
		if (fieldName === 'firstClasslabelLg1' && correspondence[fieldName]) {
			return (
				<li key={fieldName}>
					{mapping[fieldName]} :{' '}
					<Link
						to={`/classifications/classification/${
							correspondence.idFirstClass
						}`}
					>
						{correspondence.firstClasslabelLg1}
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
		if (fieldName === 'secondClasslabelLg1' && correspondence[fieldName]) {
			return (
				<li key={fieldName}>
					{mapping[fieldName]} :{' '}
					<Link
						to={`/classifications/classification/${
							correspondence.idSecondClass
						}`}
					>
						{correspondence.secondClasslabelLg1}
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
