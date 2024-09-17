export const cleanId = (id: string) => {
	return id.replace(/ /g, '-').toLowerCase();
};
