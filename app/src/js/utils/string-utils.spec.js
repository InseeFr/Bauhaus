import { removeTrailingSlash, bindToCollectionId } from './string-utils';

describe('string-utils', () => {
	describe('removeTrailingSlash', () => {
		it('should return empty string', () => {
			expect(removeTrailingSlash('')).toEqual('');
		});

		it('should return same string', () => {
			expect(removeTrailingSlash('aaa')).toEqual('aaa');
		});

		it('should return modified string', () => {
			expect(removeTrailingSlash('http://id.insee.fr/')).toEqual(
				'http://id.insee.fr'
			);
		});
	});
	describe('bindToCollectionId', () => {
		it('should return empty string', () => {
			expect(bindToCollectionId('')).toEqual('');
		});

		it('should return same string', () => {
			expect(bindToCollectionId('aaa')).toEqual('aaa');
		});

		it('should return modified string', () => {
			expect(bindToCollectionId('AA BB')).toEqual('aa-bb');
		});
		it('should return modified string', () => {
			expect(bindToCollectionId('AA BB CC  DD')).toEqual('aa-bb-cc--dd');
		});
	});
});
