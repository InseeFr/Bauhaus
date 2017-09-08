export const dateTimeToDateString = dateTime => {
	// TODO
	// Date english
	const dateString =
		dateTime.substring(8, 10) +
		'/' +
		dateTime.substring(5, 7) +
		'/' +
		dateTime.substring(0, 4);
	return dateString;
};

export const isEmpty = string => {
	if (!string || string === null || string === '<p>undefined</p>') return true;
	else {
		return false;
	}
};
