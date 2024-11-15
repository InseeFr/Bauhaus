import { validate } from './validation';

describe('validation', function () {
	it('should return an error for prefLabelLg1', function () {
		expect(
			validate({
				prefLabelLg1: '',
				prefLabelLg2: 'prefLabelLg2',
				creators: ['creator'],
			}),
		).toEqual({
			errorMessage: ['The property <strong>Intitulé</strong> is required.'],
			fields: {
				prefLabelLg1: 'The property <strong>Intitulé</strong> is required.',
				prefLabelLg2: '',
				creators: '',
			},
		});
	});
	it('should return an error for prefLabelLg2', function () {
		expect(
			validate({
				prefLabelLg1: 'prefLabelLg1',
				prefLabelLg2: '',
				creators: ['creator'],
			}),
		).toEqual({
			errorMessage: ['The property <strong>Title</strong> is required.'],
			fields: {
				prefLabelLg1: '',
				prefLabelLg2: 'The property <strong>Title</strong> is required.',
				creators: '',
			},
		});
	});
	it('should return an error for creators', function () {
		expect(
			validate({
				prefLabelLg1: 'prefLabelLg1',
				prefLabelLg2: 'prefLabelLg2',
			}),
		).toEqual({
			errorMessage: ['The property <strong>Owner</strong> is required.'],
			fields: {
				prefLabelLg1: '',
				prefLabelLg2: '',
				creators: 'The property <strong>Owner</strong> is required.',
			},
		});
	});
	it('should return an error if creators is an empty array', function () {
		expect(
			validate({
				prefLabelLg1: 'prefLabelLg1',
				prefLabelLg2: 'prefLabelLg2',
				creators: [],
			}),
		).toEqual({
			errorMessage: ['The property <strong>Owner</strong> is required.'],
			fields: {
				prefLabelLg1: '',
				prefLabelLg2: '',
				creators: 'The property <strong>Owner</strong> is required.',
			},
		});
	});
	it('should return no error', function () {
		expect(
			validate({
				prefLabelLg1: 'prefLabelLg1',
				prefLabelLg2: 'prefLabelLg2',
				creators: ['creator'],
			}),
		).toEqual({
			errorMessage: [],
			fields: {
				prefLabelLg1: '',
				prefLabelLg2: '',
				creators: '',
			},
		});
	});
});
