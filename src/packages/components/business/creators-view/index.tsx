import { Note } from '@components/note';
import { useV2StampsMap } from '../../../utils/hooks/stamps';
import { D1 } from '../../../modules-operations/i18n/build-dictionary';

interface CreatorsViewTypes {
	creators?: string | string[];
}

export const CreatorsView = ({ creators }: CreatorsViewTypes) => {
	const stampsMap = useV2StampsMap();

	const getCreatorLabel = (value: string): string => {
		return stampsMap.get(value) ?? value;
	};

	if (!creators || (Array.isArray(creators) && creators.length === 0)) {
		return (
			<Note
				text={<p></p>}
				title={D1.creatorTitle}
				alone={true}
				allowEmpty={true}
			/>
		);
	}

	const creatorsArray = Array.isArray(creators) ? creators : [creators];

	const text =
		creatorsArray.length === 1 ? (
			<p>{getCreatorLabel(creatorsArray[0])}</p>
		) : (
			<ul>
				{creatorsArray.map((creator) => (
					<li key={creator}>{getCreatorLabel(creator)}</li>
				))}
			</ul>
		);

	return (
		<Note
			text={text}
			title={D1.creatorTitle}
			alone={true}
			allowEmpty={true}
		/>
	);
};

