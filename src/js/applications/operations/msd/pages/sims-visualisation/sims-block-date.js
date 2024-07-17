import { DateUtils } from '../../../../../utils';

const SimsBlockDate = ({ currentSection }) => {
	return DateUtils.stringToDate(currentSection.value);
};

export default SimsBlockDate;
