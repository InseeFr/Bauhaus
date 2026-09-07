/**
 * Les tests e2e écrivent dans un vrai dépôt RDF : rien n'est rollbacké entre
 * deux exécutions. Toutes les données créées portent donc un suffixe unique,
 * pour que la suite reste rejouable sur une base déjà polluée par un run
 * précédent (et pour qu'aucune assertion ne dépende d'un décompte global).
 */
const PREFIX = 'E2E';

export const uniqueLabel = (name: string) =>
	`${PREFIX} ${name} ${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;

export const uniqueId = (name: string) =>
	`${PREFIX}_${name}_${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`.toUpperCase();
