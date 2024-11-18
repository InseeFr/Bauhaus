import { ValidationState } from '@components/status';

export type Classification = {
	id: string;
	general: {
		id: string;
		prefLabelLg1: string;
		prefLabelLg2: string;
		scopeNoteLg1: string;
		scopeNoteLg2: string;
		changeNoteLg1: string;
		changeNoteLg2: string;
		descriptionLg1: string;
		descriptionLg2: string;
	};
	levels: unknown[];
	validationState: ValidationState;
};
