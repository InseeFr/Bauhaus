export const baseHost =
	process.env.NODE_ENV === 'production'
		? './api'
		: 'http://localhost:6969/Gncs-Back-Office/api';

export const baseHostConcepts = `${baseHost}/concepts`;
export const baseHostOperations = `${baseHost}/operations`;

export const version = '1.1.2';
