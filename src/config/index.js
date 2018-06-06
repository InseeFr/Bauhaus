const apiUrl = `${window.location.origin}/api-url.json`;
export const baseHost = process.env.REACT_APP_INSEE
	? apiUrl.bauhaus
	: process.env.REACT_APP_API_BASE_HOST;

export const baseHostConcepts = `${baseHost}/concepts`;
export const baseHostClassification = `${baseHost}/classifications`;
export const baseHostOperations = `${baseHost}/operations`;
