export const regexValidMail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const getContentDisposition = disposition => {
	const regex = /filename[^;\n=]*="((['"]).*?\2|[^;\n]*)"/;
	return disposition.match(regex);
};
export const allTagA = /(\(<a\b[^>]*>)[^<>]*(<\/a>\))/g;
