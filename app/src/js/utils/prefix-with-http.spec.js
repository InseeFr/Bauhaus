import prefixWithHttp from './prefix-with-http';

describe('prefixWithHttp', () => {
	const http = 'http://id.insee.fr';
	const https = 'https://id.insee.fr';
	it('should return empty string', () => {
		expect(prefixWithHttp()).toEqual('');
	});

	it('should return same string', () => {
		expect(prefixWithHttp(http)).toEqual(http);
		expect(prefixWithHttp(https)).toEqual(https);
	});

	it('should return http string', () => {
		expect(prefixWithHttp('id.insee.fr')).toEqual(http);
	});
});
