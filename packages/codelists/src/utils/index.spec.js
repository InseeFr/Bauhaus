import { validatePartialCodelist } from './index';

describe('validatePartialCodelist', () => {
	it('should return no error', () => {
		expect(validatePartialCodelist({
			id: 'id',
			parentCode: 'parentCode',
			labelLg1: 'labelLg1',
			labelLg2: 'labelLg2',
			creator: 'creator',
			disseminationStatus: 'disseminationStatus',
		})).toEqual({
			errorMessage: [],
			fields: {}
		})
	})
	it('should return the error if the labelLg1 and labelLg2 contain unacceptable characters', () => {
		expect(validatePartialCodelist({
			id: 'i d',
			parentCode: 'parentCode',
			labelLg1: 'labelLg1',
			labelLg2: 'labelLg2',
			creator: 'creator',
			disseminationStatus: 'disseminationStatus',
		})).toEqual({
			errorMessage: [
				'The property <strong>Identifiant</strong> has invalid characters.'
			],
			fields: {
				id: 'The property <strong>Identifiant</strong> has invalid characters.'
			}
		})
	})
})
