export const cleanId = (id: string) => {
	return id.replace(/ /g, '-').toLowerCase();
};
export const deburr = (str: string): string => {
	return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};
