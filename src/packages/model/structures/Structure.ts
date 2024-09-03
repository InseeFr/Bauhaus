import { ValidationState } from '../../components';

export type StructuresList = {
	iri: string;
	labelLg1: string;
}[];

export type Structure = {
	id: string;
	labelLg1: string;
	labelLg2: string;
	descriptionLg1: string;
	descriptionLg2: string;
	componentDefinitions: any[];
	disseminationStatus: string;
	creator: string;
	identifiant: string;
	created: string | Date;
	modified: string | Date;
	contributor: string[] | string;
	validationState: ValidationState;
};
