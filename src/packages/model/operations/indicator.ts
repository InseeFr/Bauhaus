import { ValidationState } from '../../components';

export type Indicator = {
	id: string;
	idSims: string;
	validationState: ValidationState;
	creators: string[];
};
