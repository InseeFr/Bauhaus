import { isDocument, isLink } from './utils';

describe('isLink', () => {
	it('should return true', () => {
		expect(isLink({ uri: 'url/page/1'})).toBeTruthy()
	})
	it('should return false', () => {
		expect(isLink({ uri: 'url/document/1'})).toBeFalsy();
	})
	it('should return false if undefined', () => {
		expect(isLink()).toBeFalsy();
	})
	it('should return false if uri undefined', () => {
		expect(isDocument({})).toBeFalsy();
	})
});

describe('isDocument', () => {
	it('should return false', () => {
		expect(isDocument({ uri: 'url/page/1'})).toBeFalsy();
	})
	it('should return true', () => {
		expect(isDocument({ uri: 'url/document/1'})).toBeTruthy()
	})
	it('should return false if undefined', () => {
		expect(isDocument()).toBeFalsy();
	})

	it('should return false if uri undefined', () => {
		expect(isDocument({})).toBeFalsy();
	})
});
