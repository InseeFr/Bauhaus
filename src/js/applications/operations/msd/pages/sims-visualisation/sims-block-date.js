import { DateUtils } from 'js/utils';

const SimsBlockDate = ({ currentSection }) => {
	return DateUtils.stringToDate(currentSection.value);
};

export default SimsBlockDate;
