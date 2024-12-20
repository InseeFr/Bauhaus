import { ValidationState } from '@components/status';

import { Operation } from '../Operation';

export interface Series {
	id: string;
	creators: string[];
	validationState: ValidationState;
	idSims?: string;
	operations: Operation[];
}
