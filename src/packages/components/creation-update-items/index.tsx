import { stringToDate } from '../../utils/date-utils';
import { createAllDictionary } from '../../utils/dictionnary';

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
export const DateItem = ({ date }: Readonly<{ date: string }>) => {
	if (!date || date === '') {
		return <></>;
	}
	return <>{stringToDate(date)}</>;
};

export const CreationUpdateItems = ({
	creation,
	update,
}: Readonly<{
	creation: string;
	update: string;
}>) => {
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
