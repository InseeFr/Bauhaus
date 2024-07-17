import reducerLevelGeneral, { getGeneral } from './general';
import * as A from '../../../actions/constants';
import { LOADING, LOADED } from '../../../constants';
import * as generalUtils from '../../../applications/classifications/utils/level/general';

describe('reducerLevelGeneral', () => {
	test('action LOAD_CLASSIFICATION_LEVEL_GENERAL', () => {
		const action = {
			type: A.LOAD_CLASSIFICATION_LEVEL_GENERAL,
			payload: { classificationId: 'nafr2', levelId: 'sections' },
		};
		const result = reducerLevelGeneral(
			{
				nafr2: {
					sections: 'previous',
					divisions: 'previous',
				},
			},
			action
		);
		expect(result).toEqual({
			nafr2: {
				sections: {
					status: LOADING,
				},
				divisions: 'previous',
			},
		});
	});
	test('action LOAD_CLASSIFICATION_LEVEL_GENERAL_SUCCESS', () => {
		const action = {
			type: A.LOAD_CLASSIFICATION_LEVEL_GENERAL_SUCCESS,
			payload: {
				classificationId: 'nafr2',
				levelId: 'sections',
				results: { prefLabelLg1: 'Label' },
			},
		};
		const result = reducerLevelGeneral(
			{
				nafr2: {
					sections: 'previous',
					divisions: 'previous',
				},
			},
			action
		);
		expect(result).toEqual({
			nafr2: {
				sections: {
					status: LOADED,
					results: Object.assign(generalUtils.empty(), {
						prefLabelLg1: 'Label',
					}),
				},
				divisions: 'previous',
			},
		});
	});
});

describe('getGeneral', () => {
	test('getGeneral selector should extract nothing', () => {
		const result = getGeneral(
			{
				nafr2: {
					sections: { status: LOADED, results: 'data' },
				},
			},
			'nafr2',
			'divisions'
		);
		expect(result).toEqual();
	});
	test('getGeneral selector should extract results', () => {
		const result = getGeneral(
			{
				nafr2: {
					sections: { status: LOADED, results: 'data' },
				},
			},
			'nafr2',
			'sections'
		);
		expect(result).toEqual('data');
	});
});
