export const DSURLToLabel = dsURL => {
	// TODO
	// english (or connect to the store ?)
	if (dsURL.endsWith('PublicGenerique')) return 'Public générique';
	if (dsURL.endsWith('PublicSpecifique')) return 'Public spécifique';
	if (dsURL.endsWith('Prive')) return 'Privé';
	else return 'Statut de diffusion inconnu';
};
