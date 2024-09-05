import { Sims } from '../Sims';

export type Document = {
	id?: string;
	labelLg1: string;
	labelLg2: string;
	url?: string;
	updatedDate?: string;
	files?: any[];
	lang: string;
	sims?: Sims[];
};
