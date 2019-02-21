import { mapStateToProps } from './home-container';
import { NOT_LOADED, LOADED } from 'js/constants';

describe('CorrespondencesHomeContainer', () => {
	it('should return the NOT_LOADED status', () => {
		const input = {};
		const output = {
			status: NOT_LOADED,
			correspondences: [],
		};
		expect(mapStateToProps(input)).toEqual(output);
	});
	it('should return a list of correspondences', () => {
		const input = {
			classificationsCorrespondencesList: {
				results: ['correspondences'],
				status: LOADED,
				err: 'err',
			},
		};
		const output = {
			correspondences: ['correspondences'],
			status: LOADED,
			err: 'err',
		};
		expect(mapStateToProps(input)).toEqual(output);
	});
});
