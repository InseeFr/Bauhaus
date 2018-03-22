import buildExtract from './build-extract';

describe('build-extract', () => {
	it('should return a param', () => {
		const props = { match: { params: { id: 'id' } } };
		expect(buildExtract('id')(props)).toEqual('id');
	});
});
