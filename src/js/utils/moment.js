import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

export const isDateIn = (date, start, end) => {
	const range = moment.range(
		!start ? null : moment(start),
		!end ? null : moment(end)
	);
	return range.contains(moment(date));
};

export const isDateInDumb = (date, start, end) => start <= date && date <= end;
