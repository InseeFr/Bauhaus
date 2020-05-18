import dayjs from 'dayjs';
import { getLang } from '@inseefr/wilco';
import isBetween from 'dayjs/plugin/isBetween';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/en';
import 'dayjs/locale/fr';

dayjs.extend(isBetween);
dayjs.extend(LocalizedFormat);

export const isDateIn = (date, start, end) => {
	if (!start || !end) {
		return true;
	}
	return dayjs(date).isBetween(start, end);
};

export const isOutOfDate = end => dayjs().isAfter(end);

export const today = () =>
	dayjs()
		.locale(getLang())
		.format('L');

export const stringToDate = (string, lang) =>
	dayjs(string)
		.locale(lang || getLang())
		.format('L');
