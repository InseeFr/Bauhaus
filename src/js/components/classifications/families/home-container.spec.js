import { mapStateToProps } from './home-container';
import { NOT_LOADED, LOADED } from 'js/constants';
describe('mapStateToProps', () => {
	it('should return NOT_LOADED status', () => {
		const input = {};
		const output = {
			status: NOT_LOADED,
			families: [],
		};
		expect(mapStateToProps(input)).toEqual(output);
	});
	it('should return LOADED status', () => {
		const input = {
			classificationsFamiliesList: {
				results: 'families',
				err: 'err',
				status: LOADED,
			},
		};
		const output = {
			status: LOADED,
			families: 'families',
			err: 'err',
		};
		expect(mapStateToProps(input)).toEqual(output);
	});
});
