import Moment from 'moment';
import { extendMoment } from 'moment-range';

import { getLang } from 'bauhaus-library';

const moment = extendMoment(Moment);

export const isDateIn = (date, start, end) => {
	const range = moment.range(
		!start ? null : moment(start),
		!end ? null : moment(end)
	);
	return range.contains(moment(date));
};

export const isOutOfDate = end => !isDateIn(moment(), null, end);

export const today = () =>
	moment()
		.locale(getLang())
		.format('L');

export const stringToDate = (string, lang) =>
	moment(string)
		.locale(lang || getLang())
		.format('L');
