import reducerClassificationCorrespondenceGeneral, {
	getGeneral,
} from './general';
import * as A from 'js/actions/constants';
import { LOADED } from 'js/constants';
import * as generalUtils from 'js/applications/classifications/utils/correspondence/general';

describe('reducerClassificationCorrespondenceGeneral', () => {
	test('action LOAD_CLASSIFICATION_CORRESPONDENCE_GENERAL_SUCCESS', () => {
		const action = {
			type: A.LOAD_CLASSIFICATION_CORRESPONDENCE_GENERAL_SUCCESS,
			payload: {
				id: 'id1',
				results: {
					id: 'id1',
					labelLg1: 'Label',
					idFirstClass: 'idF',
					firstClassLabelLg1: 'Label class 1',
					idSecondClass: 'idS',
					secondClassLabelLg1: 'Label class 2',
				},
			},
		};
		const result = reducerClassificationCorrespondenceGeneral({}, action);
		expect(result).toEqual({
			id1: {
				status: LOADED,
				results: Object.assign(generalUtils.empty(), {
					id: 'id1',
					labelLg1: 'Label',
					idFirstClass: 'idF',
					firstClassLabelLg1: 'Label class 1',
					idSecondClass: 'idS',
					secondClassLabelLg1: 'Label class 2',
				}),
			},
		});
	});
});

describe('getGeneral', () => {
	test('getGeneral selector should extract nothing', () => {
		const result = getGeneral({ id1: { results: 'results' } }, 'id2');
		expect(result).toEqual();
	});
	test('getGeneral selector should extract results', () => {
		const result = getGeneral({ id1: { results: 'results' } }, 'id1');
		expect(result).toEqual('results');
	});
});
