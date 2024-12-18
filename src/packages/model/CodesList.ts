export interface Code {
	iri: string;
	labelLg1: string;
	code: string;
}

export interface CodesList {
	id?: string;
	codes: Code[];
	notation: string;
}

export type CodesLists = {
	id: string;
	label: string;
	notation: string;
}[];
