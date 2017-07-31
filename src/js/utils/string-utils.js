const trailingRegExp = /\/$/;
export const removeTrailingSlash = url => url.replace(trailingRegExp, '');
