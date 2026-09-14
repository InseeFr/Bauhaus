import { getLang } from "./dictionary";

const toTime = (date: Date | string) => new Date(date).getTime();

const formatLocalized = (time: number, lang: string) =>
  new Intl.DateTimeFormat(lang, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(time);

export const isDateIn = (
  date: Date | string,
  start: Date | string,
  end: Date | string,
): boolean => {
  if (!start || !end) {
    return true;
  }

  const time = toTime(date);

  return time > toTime(start) && time < toTime(end);
};

export const isOutOfDate = (end: Date | string) => {
  if (!end) {
    return false;
  }

  const time = toTime(end);

  return !Number.isNaN(time) && Date.now() > time;
};

export const today = () => formatLocalized(Date.now(), getLang());

export const stringToDate = (string: string | undefined, lang?: string) => {
  if (!string) {
    return "";
  }

  const time = toTime(string);

  if (Number.isNaN(time)) {
    return "";
  }

  return formatLocalized(time, lang || getLang());
};
