import { stringToDate } from '../../utils/date-utils';
import D from '../../i18n/build-dictionary';

export const DateItem = ({ date }) => {
	if (!date || date === '') {
		return '';
	}
	return stringToDate(date);
};

const CreationUpdateItem = ({ creation, update }) => {
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

export default CreationUpdateItem;
