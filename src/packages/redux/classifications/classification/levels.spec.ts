import reducerClassificationLevels, { getLevels } from './levels';
import { LOAD_CLASSIFICATION_LEVELS_SUCCESS } from '../../actions/constants';
import { LOADED } from '@sdk/constants';

describe('reducerSeriesMembers', () => {
	test('action LOAD_CLASSIFICATION_LEVELS_SUCCESS', () => {
		const action = {
			type: LOAD_CLASSIFICATION_LEVELS_SUCCESS,
			payload: { id: 'id1', results: 'levels' },
		};
		const result = reducerClassificationLevels(
			{ id1: 'previous', id2: 'previous' },
			action,
		);
		expect(result).toEqual({
			id1: {
				status: LOADED,
				results: 'levels',
			},
			id2: 'previous',
		});
	});
});

describe('getLevels', () => {
	test('getLevels selector should extract nothing', () => {
		const result = getLevels({ id1: { results: 'levels' } }, 'id2');
		expect(result).toEqual(undefined);
	});
	test('getLevels selector should extract results', () => {
		const result = getLevels({ id1: { results: 'levels' } }, 'id1');
		expect(result).toEqual('levels');
	});
});
