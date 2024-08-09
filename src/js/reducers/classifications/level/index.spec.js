import { getLevel } from './';
import { LOADED } from '../../../new-architecture/sdk/constants';

describe('getLevel', () => {
	test('getLevel selector should extract results', () => {
		const result = getLevel(
			{ classificationLevelGeneral: {}, classificationLevelMembers: {} },
			'id1',
			'id1'
		);
		expect(result).toEqual();
	});
	test('getConcept selector should extract results', () => {
		const result = getLevel(
			{
				classificationLevelGeneral: {
					nafr2: {
						sections: { status: LOADED, results: 'data' },
					},
				},
				classificationLevelMembers: {
					nafr2: {
						sections: { status: LOADED, results: 'members' },
					},
				},
			},
			'nafr2',
			'sections'
		);
		expect(result).toEqual({
			general: 'data',
			members: 'members',
		});
	});
});
