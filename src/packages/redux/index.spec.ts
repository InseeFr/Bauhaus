import * as selector from './selectors';
import { ReduxModel } from './model';

describe('getSerie', () => {
	it('should return an empty object if the value is undefined', () => {
		const input = {} as ReduxModel;
		const output = {};
		expect(selector.getSerie(input)).toEqual(output);
	});
	it('should return the object', () => {
		const input = {
			operationsSeriesCurrent: 'operationsSeriesCurrent',
		} as ReduxModel;
		const output = 'operationsSeriesCurrent';
		expect(selector.getSerie(input)).toEqual(output);
	});
});

describe('getIndicator', () => {
	it('should return an empty object if the value is undefined', () => {
		const input = {} as ReduxModel;
		const output = {};
		expect(selector.getOperationsSimsCurrent(input)).toEqual(output);
	});
	it('should return the object', () => {
		const input = {
			operationsSimsCurrent: 'operationsSimsCurrent',
		} as ReduxModel;
		const output = 'operationsSimsCurrent';
		expect(selector.getOperationsSimsCurrent(input)).toEqual(output);
	});
});
