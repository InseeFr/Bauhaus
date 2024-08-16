import jwt_decode from 'jwt-decode';
import {
	SESSION_ITEM,
	getToken,
	removeToken,
	storeToken,
	getAuthPropsFromToken,
	isTokenValid,
} from './token-utils';

jest.mock('jwt-decode');

describe('Token Utility Functions', () => {
	beforeEach(() => {
		localStorage.clear();
		jest.clearAllMocks();
	});

	describe('getToken', () => {
		it('should return the token from localStorage', () => {
			localStorage.setItem(SESSION_ITEM, 'test-token');
			const token = getToken();
			expect(token).toBe('test-token');
		});

		it('should return null if localStorage is not available', () => {
			const originalLocalStorage = global.localStorage;
			delete global.localStorage;
			const token = getToken();
			global.localStorage = originalLocalStorage;
			expect(token).toBeNull();
		});
	});

	describe('removeToken', () => {
		it('should remove the token from localStorage', () => {
			localStorage.setItem(SESSION_ITEM, 'test-token');
			removeToken();
			const token = localStorage.getItem(SESSION_ITEM);
			expect(token).toBeNull();
		});
	});

	describe('storeToken', () => {
		it('should set the token in localStorage', () => {
			storeToken('test-token');
			const token = localStorage.getItem(SESSION_ITEM);
			expect(token).toBe('test-token');
		});
	});

	describe('getAuthPropsFromToken', () => {
		it('should return roles and stamp from the parsed token', () => {
			const tokenParsed = {
				realm_access: { roles: ['role1', 'role2'] },
				timbre: 'timestamp',
			};
			const authProps = getAuthPropsFromToken(tokenParsed);
			expect(authProps).toEqual({
				roles: ['role1', 'role2'],
				stamp: 'timestamp',
			});
		});
	});

	describe('isTokenValid', () => {
		it('should return true if the token is valid', () => {
			const token = 'valid-token';
			jwt_decode.mockReturnValue({ exp: new Date().getTime() / 1000 + 60 });
			const isValid = isTokenValid(token);
			expect(isValid).toBe(true);
		});

		it('should return false if the token is expired', () => {
			const token = 'expired-token';
			jwt_decode.mockReturnValue({ exp: new Date().getTime() / 1000 - 60 });
			const isValid = isTokenValid(token);
			expect(isValid).toBe(false);
		});
	});
});
