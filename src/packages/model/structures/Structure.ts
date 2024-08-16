import { ValidationState } from '../../components';

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
	created: string;
	modified: string;
	contributor: string[];
	validationState: ValidationState;
};
