export const DSURLToLabel = dsURL => {
	if (dsURL.endsWith('PublicGenerique')) return 'Public générique';
	if (dsURL.endsWith('PublicSpecifique')) return 'Public spécifique';
	if (dsURL.endsWith('Prive')) return 'Privé';
	else return 'Statut de diffusion inconnu';
};
