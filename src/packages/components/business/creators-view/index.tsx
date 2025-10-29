import { Note } from '@components/note';
import { useV2StampsMap } from '../../../utils/hooks/stamps';
import { D1 } from '../../../modules-operations/i18n/build-dictionary';
import { List } from '../../ui/list';

interface CreatorsViewTypes {
	creators?: string | string[];
	render?: (creators: string[]) => React.ReactNode;
}

export const CreatorsView = ({ creators, render }: CreatorsViewTypes) => {
	const stampsMap = useV2StampsMap();

	const getCreatorLabel = (value: string): string => {
		return stampsMap.get(value) ?? value;
	};

	if (!creators || (Array.isArray(creators) && creators.length === 0)) {
		if (render) {
			return <>{render([])}</>;
		}

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

	if (render) {
		return <>{render(creatorsArray.map(getCreatorLabel))}</>;
	}

	const text =
		creatorsArray.length === 1 ? (
			<p>{getCreatorLabel(creatorsArray[0])}</p>
		) : (
			<List<string>
				items={creatorsArray}
				getContent={(item) => getCreatorLabel(item)}
				getKey={(item) => item}
			/>
		);

	return (
		<Note text={text} title={D1.creatorTitle} alone={true} allowEmpty={true} />
	);
};

