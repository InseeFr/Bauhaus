import reducerCorrespondenceAssociation, {
	getAssociation,
} from './association';
import * as associationUtils from '../../../modules-classifications/utils/correspondence/association';
import {
	LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATION,
	LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATION_SUCCESS,
} from '../../actions/constants';
import { LOADED, LOADING } from '@sdk/constants';

describe('reducerCorrespondenceAssociation', () => {
	test('action LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATION', () => {
		const action = {
			type: LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATION,
			payload: { correspondenceId: 'nafr2-cpfr21', associationId: 'B-B' },
		};
		const result = reducerCorrespondenceAssociation(
			{
				'nafr2-cpfr21': {
					'A-A': 'previous',
					'C-C': 'previous',
				},
			},
			action,
		);
		expect(result).toEqual({
			'nafr2-cpfr21': {
				'B-B': {
					status: LOADING,
				},
				'A-A': 'previous',
				'C-C': 'previous',
			},
		});
	});
	test('action LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATION_SUCCESS', () => {
		const action = {
			type: LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATION_SUCCESS,
			payload: {
				correspondenceId: 'nafr2-cpfr21',
				associationId: 'A-A',
				results: { labelLg1: 'Label' },
			},
		};
		const result = reducerCorrespondenceAssociation(
			{
				'nafr2-cpfr21': {
					'B-B': 'previous',
					'C-C': 'previous',
				},
			},
			action,
		);
		expect(result).toEqual({
			'nafr2-cpfr21': {
				'A-A': {
					status: LOADED,
					results: {
						...associationUtils.empty(),
						labelLg1: 'Label',
					},
				},
				'B-B': 'previous',
				'C-C': 'previous',
			},
		});
	});
});

describe('getAssociation', () => {
	test('getAssociation selector should extract nothing', () => {
		const result = getAssociation(
			{
				classificationsCorrespondenceAssociation: {
					'nafr2-cpfr21': {
						'A-A': { status: LOADED, results: 'data' },
					},
				},
			},
			'nafr2-cpfr21',
			'B-B',
		);
		expect(result).toEqual(undefined);
	});
	test('getAssociation selector should extract results', () => {
		const result = getAssociation(
			{
				classificationsCorrespondenceAssociation: {
					'nafr2-cpfr21': {
						'A-A': { status: LOADED, results: 'data' },
					},
				},
			},
			'nafr2-cpfr21',
			'A-A',
		);
		expect(result).toEqual('data');
	});
});
