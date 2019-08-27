import { removeTrailingSlash, cleanId } from './string-utils';

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
	describe('cleanId', () => {
		it('should return empty string', () => {
			expect(cleanId('')).toEqual('');
		});

		it('should return same string', () => {
			expect(cleanId('aaa')).toEqual('aaa');
		});

		it('should return modified string', () => {
			expect(cleanId('AA BB')).toEqual('aa-bb');
		});
		it('should return modified string', () => {
			expect(cleanId('AA BB CC  DD')).toEqual('aa-bb-cc--dd');
		});
	});
});
