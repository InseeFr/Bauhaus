import { Note } from '@components/note';

import { D1 } from '../../i18n/build-dictionary';

type CreatorsViewTypes = {
	creators: string | string[];
};
const CreatorsView = ({ creators }: CreatorsViewTypes) => {
	const creatorsArray = Array.isArray(creators) ? creators : [creators];
	return (
		<Note
			text={
				creatorsArray.length === 1 ? (
					<p>{creatorsArray[0]}</p>
				) : (
					<ul>
						{creatorsArray.map((creator, index) => (
							<li key={index}>{creator}</li>
						))}
					</ul>
				)
			}
			title={D1.creatorTitle}
			alone={true}
			allowEmpty={true}
		/>
	);
};

export default CreatorsView;
