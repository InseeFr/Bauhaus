import React from 'react';
import { Note } from '@inseefr/wilco';
import { D1 } from '../i18n/build-dictionary';

const CreatorsView = ({ creators, lg1 }) => {
	const creatorsArray = Array.isArray(creators) ? creators : [creators];
	return (
		<Note
			text={
				<ul>
					{creatorsArray.map((creator, index) => (
						<li key={index}>{creator}</li>
					))}
				</ul>
			}
			title={D1.creatorTitle}
			lang={lg1}
			alone={true}
			allowEmpty={true}
		/>
	);
};

export default CreatorsView;
