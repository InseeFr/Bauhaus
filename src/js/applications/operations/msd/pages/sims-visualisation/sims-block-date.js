import { stringToDate } from '../../../../../new-architecture/utils/date-utils';

const SimsBlockDate = ({ currentSection }) => {
	return stringToDate(currentSection.value);
};

export default SimsBlockDate;
