import { createAllDictionary } from '../../utils/dictionnary';
import { stringToDate } from '../../utils/date-utils';

const { D } = createAllDictionary({
	createdDateTitle: {
		fr: 'Date de création',
		en: 'Creation date',
	},
	modifiedDateTitle: {
		fr: 'Date de modification',
		en: 'Modification date',
	},
});
export const DateItem = ({ date }: { date: string }) => {
	if (!date || date === '') {
		return <></>;
	}
	return <>{stringToDate(date)}</>;
};

export const CreationUpdateItems = ({
	creation,
	update,
}: {
	creation: string;
	update: string;
}) => {
	return (
		<>
			<li>
				{D.createdDateTitle} : <DateItem date={creation} />
			</li>
			<li>
				{D.modifiedDateTitle} : <DateItem date={update} />
			</li>
		</>
	);
};
