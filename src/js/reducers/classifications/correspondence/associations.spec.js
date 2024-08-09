import reducerClassificationCorrespondenceAssociations, {
	getAssociations,
} from './associations';
import * as A from '../../../actions/constants';
import { LOADED } from '../../../new-architecture/sdk/constants';

describe('reducerSeriesMembers', () => {
	test('action LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATIONS_SUCCESS', () => {
		const action = {
			type: A.LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATIONS_SUCCESS,
			payload: { id: 'id1', results: 'associations' },
		};
		const result = reducerClassificationCorrespondenceAssociations(
			{ id1: 'previous', id2: 'previous' },
			action
		);
		expect(result).toEqual({
			id1: {
				status: LOADED,
				results: 'associations',
			},
			id2: 'previous',
		});
	});
});

describe('getAssociations', () => {
	test('getAssociations selector should extract nothing', () => {
		const result = getAssociations({ id1: { results: 'associations' } }, 'id2');
		expect(result).toEqual();
	});
	test('getAssociations selector should extract results', () => {
		const result = getAssociations({ id1: { results: 'associations' } }, 'id1');
		expect(result).toEqual('associations');
	});
});
