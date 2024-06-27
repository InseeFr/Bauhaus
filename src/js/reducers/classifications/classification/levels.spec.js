import reducerClassificationLevels, { getLevels } from './levels';
import * as A from 'js/actions/constants';
import { LOADED } from 'js/constants';

describe('reducerSeriesMembers', () => {
	test('action LOAD_CLASSIFICATION_LEVELS_SUCCESS', () => {
		const action = {
			type: A.LOAD_CLASSIFICATION_LEVELS_SUCCESS,
			payload: { id: 'id1', results: 'levels' },
		};
		const result = reducerClassificationLevels(
			{ id1: 'previous', id2: 'previous' },
			action
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
		expect(result).toEqual();
	});
	test('getLevels selector should extract results', () => {
		const result = getLevels({ id1: { results: 'levels' } }, 'id1');
		expect(result).toEqual('levels');
	});
});
