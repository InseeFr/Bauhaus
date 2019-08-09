import { mapStateToProps } from './index';

describe('OperationsFamilyEditionContainer', () => {
	it('should return families if available', () => {
		const result = mapStateToProps(
			{
				app: {
					properties: { lg1: 'lg1', lg2: 'lg2' },
				},
				operationsFamiliesCurrent: { id: 'id' },
			},
			{ match: { params: { id: '1' } } }
		);
		expect(result).toEqual({
			family: { id: 'id' },
			id: '1',
			langs: { lg1: 'lg1', lg2: 'lg2' },
		});
	});
});
