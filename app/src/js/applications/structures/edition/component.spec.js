import { validate } from './component';

describe('<Edition />', () => {
	it('should return an error if the id is not defined', () => {
		expect(validate({
			labelLg1: 'label',
			labelLg2: 'label'
		})).toEqual(['The property <strong>Notation</strong> is required.']);
	});
	it('should return an error if the labelLg1 is not defined', () => {
		expect(
			validate({
				identifiant: '1',
				labelLg2: 'label'
			})
		).toEqual(['The property <strong>Libellé</strong> is required.']);
	});
	it('should return an error if the labelLg2 is not defined', () => {
		expect(
			validate({
				identifiant: '1',
				labelLg1: 'label',
			})
		).toEqual(['The property <strong>Label</strong> is required.']);
	});
	it('should not return any error', () => {
		expect(
			validate({
				identifiant: '1',
				labelLg1: 'label',
				labelLg2: 'label',
			})
		).toEqual([]);
	});
});
