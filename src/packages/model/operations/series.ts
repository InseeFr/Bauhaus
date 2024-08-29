import { ValidationState } from '../../components';
import { Operation } from '../Operation';

export type Series = {
	id: string;
	creators: string[];
	validationState: ValidationState;
	idSims?: string;
	operations: Operation[];
};
