import { isDocument, isLink } from './utils';

describe('isLink', () => {
	it('should return true', () => {
		expect(isLink({ uri: 'url/page/1'})).toBeTruthy()
	})
	it('should return false', () => {
		expect(isLink({ uri: 'url/document/1'})).toBeFalsy();
	})
});

describe('isDocument', () => {
	it('should return false', () => {
		expect(isDocument({ uri: 'url/page/1'})).toBeFalsy();
	})
	it('should return true', () => {
		expect(isDocument({ uri: 'url/document/1'})).toBeTruthy()
	})
});
