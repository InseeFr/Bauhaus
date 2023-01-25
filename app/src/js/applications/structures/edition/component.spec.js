import { validate } from './component';

describe('<Edition />', () => {
	it('should return an error if the id is not defined', () => {
		expect(validate({
			labelLg1: 'label',
			labelLg2: 'label',
		})).toEqual({
			'errorMessage': ['The property <strong>Notation</strong> is required.'],
			'fields': { 'identifiant': 'The property <strong>Notation</strong> is required.', 'labelLg1': '', 'labelLg2': '' },
		});
	});
	it('should return an error if the labelLg1 is not defined', () => {
		expect(
			validate({
				identifiant: '1',
				labelLg2: 'label',
			}),
		).toEqual({
			'errorMessage': ['The property <strong>Libellé</strong> is required.'],
			'fields': { 'identifiant': '', 'labelLg1': 'The property <strong>Libellé</strong> is required.', 'labelLg2': '' },
		});
	});
	it('should return an error if the labelLg2 is not defined', () => {
		expect(
			validate({
				identifiant: '1',
				labelLg1: 'label',
			}),
		).toEqual({
			'errorMessage': ['The property <strong>Label</strong> is required.'],
			'fields': { 'identifiant': '', 'labelLg1': '', 'labelLg2': 'The property <strong>Label</strong> is required.' },
		});
	});
	it('should not return any error', () => {
		expect(
			validate({
				identifiant: '1',
				labelLg1: 'label',
				labelLg2: 'label',
			}),
		).toEqual({ 'errorMessage': [], 'fields': { 'identifiant': '', 'labelLg1': '', 'labelLg2': '' } });
	});
});
