import { getStamp, isLoading } from './users.action';
import { LOADED, LOADING } from '../../../new-architecture/sdk/constants';

describe('users action', () => {
	describe('selectors', () => {
		describe('getStamp', () => {
			it('should return the stamp of the user', () => {
				expect(
					getStamp({
						users: {
							results: {
								stamp: 'stamp',
							},
						},
					})
				).toBe('stamp');
			});
		});
		describe('isLoading', () => {
			it('should return true if the status is LOADING', () => {
				expect(isLoading({ users: { status: LOADING } })).toBeTruthy();
			});
			it('should return false if the status is not LOADING', () => {
				expect(isLoading({ users: { status: LOADED } })).toBeFalsy();
			});
		});
	});
});
