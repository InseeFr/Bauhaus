import Moment from 'moment';
import { extendMoment } from 'moment-range';
import 'moment/min/locales';
import { lang1 } from 'config/config';

const moment = extendMoment(Moment);

export const isDateIn = (date, start, end) => {
	const range = moment.range(
		!start ? null : moment(start),
		!end ? null : moment(end)
	);
	return range.contains(moment(date));
};

export const isOutOfDate = end => !isDateIn(moment(), null, end);

export const isDateInDumb = (date, start, end) => start <= date && date <= end;

export const today = () =>
	moment()
		.locale(lang1)
		.format('L');
