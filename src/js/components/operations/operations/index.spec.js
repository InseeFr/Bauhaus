import { mapStateToProps } from './';
import { NOT_LOADED, LOADED } from 'js/constants';
describe('mapStateToProps', () => {
	it('should return NOT_LOADED status', () => {
		const input = {};
		const output = {
			status: NOT_LOADED,
			operations: [],
		};
		expect(mapStateToProps(input)).toEqual(output);
	});
	it('should return LOADED status', () => {
		const input = {
			operationsOperationsList: {
				results: 'operations',
				err: 'err',
				status: LOADED,
			},
		};
		const output = {
			status: LOADED,
			operations: 'operations',
			err: 'err',
		};
		expect(mapStateToProps(input)).toEqual(output);
	});
});
