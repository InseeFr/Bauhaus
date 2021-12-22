import * as selector from './index';

describe('getLangs', () => {
	it('should return the langs object', () => {
		const input = {
			app: {
				lg1: 'lg1',
				lg2: 'lg2',
			},
		};
		const output = {
			lg1: 'lg1',
			lg2: 'lg2',
		};
		expect(selector.getLangs(input)).toEqual(output);
	});
});

describe('getSerie', () => {
	it('should return an empty object if the value is undefined', () => {
		const input = {};
		const output = {};
		expect(selector.getSerie(input)).toEqual(output);
	});
	it('should return the object', () => {
		const input = { operationsSeriesCurrent: 'operationsSeriesCurrent' };
		const output = 'operationsSeriesCurrent';
		expect(selector.getSerie(input)).toEqual(output);
	});
});

describe('getSeries', () => {
	it('should return an empty object if the value is undefined', () => {
		const input = {};
		const output = {};
		expect(selector.getSeries(input)).toEqual(output);
	});
	it('should return the object', () => {
		const input = { operationsSeriesList: 'operationsSeriesList' };
		const output = 'operationsSeriesList';
		expect(selector.getSeries(input)).toEqual(output);
	});
});

describe('getOperations', () => {
	it('should return an empty object if the value is undefined', () => {
		const input = {};
		const output = {};
		expect(selector.getOperations(input)).toEqual(output);
	});
	it('should return the object', () => {
		const input = { operationsOperationsList: 'operationsOperationsList' };
		const output = 'operationsOperationsList';
		expect(selector.getOperations(input)).toEqual(output);
	});
});

describe('getOperation', () => {
	it('should return an empty object if the value is undefined', () => {
		const input = {};
		const output = {};
		expect(selector.getOperation(input)).toEqual(output);
	});
	it('should return the object', () => {
		const input = {
			operationsOperationsCurrent: 'operationsOperationsCurrent',
		};
		const output = 'operationsOperationsCurrent';
		expect(selector.getOperation(input)).toEqual(output);
	});
});

describe('getIndicator', () => {
	it('should return an empty object if the value is undefined', () => {
		const input = {};
		const output = {};
		expect(selector.getOperationsSimsCurrent(input)).toEqual(output);
	});
	it('should return the object', () => {
		const input = {
			operationsSimsCurrent: 'operationsSimsCurrent',
		};
		const output = 'operationsSimsCurrent';
		expect(selector.getOperationsSimsCurrent(input)).toEqual(output);
	});
});
