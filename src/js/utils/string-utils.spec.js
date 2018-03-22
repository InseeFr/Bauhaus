import { removeTrailingSlash } from './string-utils';

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
});
