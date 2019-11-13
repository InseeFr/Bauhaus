const trailingRegExp = /\/$/;
export const removeTrailingSlash = url => url.replace(trailingRegExp, '');

export const cleanId = id => {
	return id.replace(/ /g, '-').toLowerCase();
};
