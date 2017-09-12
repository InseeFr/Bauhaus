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

export const DSURLToLabel = dsURL => {
	// TODO
	// english (or connect to the store ?)
	if (dsURL.endsWith('PublicGenerique')) return 'Public générique';
	if (dsURL.endsWith('PublicSpecifique')) return 'Public spécifique';
	if (dsURL.endsWith('Prive')) return 'Privé';
	else return 'Statut de diffusion inconnu';
};
