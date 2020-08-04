import { DateUtils } from 'bauhaus-utilities';

const SimsBlockDate = ({ currentSection }) => {
	return DateUtils.stringToDate(currentSection.value);
};

export default SimsBlockDate;
