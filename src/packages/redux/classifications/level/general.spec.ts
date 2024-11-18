import reducerLevelGeneral, { getGeneral } from './general';
import * as generalUtils from '../../../modules-classifications/utils/level/general';
import {
	LOAD_CLASSIFICATION_LEVEL_GENERAL,
	LOAD_CLASSIFICATION_LEVEL_GENERAL_SUCCESS,
} from '../../actions/constants';
import { LOADED, LOADING } from '@sdk/constants';

describe('reducerLevelGeneral', () => {
	test('action LOAD_CLASSIFICATION_LEVEL_GENERAL', () => {
		const action = {
			type: LOAD_CLASSIFICATION_LEVEL_GENERAL,
			payload: { classificationId: 'nafr2', levelId: 'sections' },
		};
		const result = reducerLevelGeneral(
			{
				nafr2: {
					sections: 'previous',
					divisions: 'previous',
				},
			},
			action,
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
			type: LOAD_CLASSIFICATION_LEVEL_GENERAL_SUCCESS,
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
			action,
		);
		expect(result).toEqual({
			nafr2: {
				sections: {
					status: LOADED,
					results: {
						...generalUtils.empty(),
						prefLabelLg1: 'Label',
					},
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
			'divisions',
		);
		expect(result).toEqual(undefined);
	});
	test('getGeneral selector should extract results', () => {
		const result = getGeneral(
			{
				nafr2: {
					sections: { status: LOADED, results: 'data' },
				},
			},
			'nafr2',
			'sections',
		);
		expect(result).toEqual('data');
	});
});
