import D from '../../i18n/build-dictionary';
import { stringToDate } from '../../../new-architecture/utils/date-utils';

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
