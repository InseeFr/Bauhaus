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
describe('getPermission', () => {
	it('should return the permission object', () => {
		const input = {
			app: {
				auth: {
					type: 'authType',
					user: {
						roles: 'roles',
						stamp: 'stamp',
					},
				},
			},
		};
		const output = {
			authType: 'authType',
			roles: 'roles',
			stamp: 'stamp',
		};
		expect(selector.getPermission(input)).toEqual(output);
	});
});
describe('getFamily', () => {
	it('should return an empty object if the value is undefined', () => {
		const input = {};
		const output = {};
		expect(selector.getFamily(input)).toEqual(output);
	});
	it('should return the object', () => {
		const input = { operationsFamiliesCurrent: 'operationsFamiliesCurrent' };
		const output = 'operationsFamiliesCurrent';
		expect(selector.getFamily(input)).toEqual(output);
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

describe('getFamilies', () => {
	it('should return an empty object if the value is undefined', () => {
		const input = {};
		const output = {};
		expect(selector.getFamilies(input)).toEqual(output);
	});
	it('should return the object', () => {
		const input = { operationsFamiliesList: 'operationsFamiliesList' };
		const output = 'operationsFamiliesList';
		expect(selector.getFamilies(input)).toEqual(output);
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
		expect(selector.getIndicator(input)).toEqual(output);
	});
	it('should return the object', () => {
		const input = {
			operationsIndicatorsCurrent: 'operationsIndicatorsCurrent',
		};
		const output = 'operationsIndicatorsCurrent';
		expect(selector.getIndicator(input)).toEqual(output);
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
