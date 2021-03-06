import { mapStateToProps } from './home-container';
import { NOT_LOADED, LOADED } from 'js/constants';
describe('mapStateToProps', () => {
	it('should return NOT_LOADED status', () => {
		const input = {};
		const output = {
			status: NOT_LOADED,
			classifications: [],
		};
		expect(mapStateToProps(input)).toEqual(output);
	});
	it('should return LOADED status', () => {
		const input = {
			classificationsList: {
				results: 'classifications',
				err: 'err',
				status: LOADED,
			},
		};
		const output = {
			status: LOADED,
			classifications: 'classifications',
			err: 'err',
		};
		expect(mapStateToProps(input)).toEqual(output);
	});
});
