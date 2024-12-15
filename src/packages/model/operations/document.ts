import { Sims } from '../Sims';

export type Document = {
	id?: string;
	labelLg1: string;
	labelLg2: string;
	descriptionLg1?: string;
	descriptionLg2?: string;
	url?: string;
	updatedDate?: string;
	files?: any[];
	lang: string;
	sims?: Sims[];
	uri?: string;
};

export type HomeDocument = {
	label: string;
	uri: string;
	lang: string;
	updatedDate: string;
	id: string;
};
