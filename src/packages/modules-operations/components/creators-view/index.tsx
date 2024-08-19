import { Note } from '@inseefr/wilco';
import { D1 } from '../../i18n/build-dictionary';

type CreatorsViewTypes = {
	lg1: string;
	creators: string | string[];
};
const CreatorsView = ({ creators, lg1 }: CreatorsViewTypes) => {
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
			lang={lg1}
			alone={true}
			allowEmpty={true}
		/>
	);
};

export default CreatorsView;
