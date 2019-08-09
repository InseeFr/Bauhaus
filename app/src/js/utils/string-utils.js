const trailingRegExp = /\/$/;
export const removeTrailingSlash = url => url.replace(trailingRegExp, '');

export const bindToCollectionId = id => {
	return id.replace(/ /g, '-').toLowerCase();
};
