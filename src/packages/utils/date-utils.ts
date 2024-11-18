//@ts-ignore
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/fr';
//@ts-ignore
import isBetween from 'dayjs/plugin/isBetween';
//@ts-ignore
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import { getLang } from './dictionnary';

dayjs.extend(isBetween);
dayjs.extend(LocalizedFormat);

export const isDateIn = (
	date: Date | string,
	start: Date | string,
	end: Date | string,
): boolean => {
	if (!start || !end) {
		return true;
	}
	return dayjs(date).isBetween(start, end);
};

export const isOutOfDate = (end: Date | string) => dayjs().isAfter(end);

export const today = () => dayjs().locale(getLang()).format('L');

export const stringToDate = (string: string, lang?: string) => {
	if (!string) {
		return '';
	}
	return dayjs(string)
		.locale(lang || getLang())
		.format('L');
};
