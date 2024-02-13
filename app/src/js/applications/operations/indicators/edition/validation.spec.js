import { validate } from './validation';

describe('validate', () => {
	it('should return an error if the prefLabelLg1 is not defined', () => {
		expect(validate({ prefLabelLg1: '', prefLabelLg2: 'prefLabelLg2', creators: ['c'] })).toEqual({
			errorMessage: ['The property <strong>Intitulé</strong> is required.'],
			fields: {
				creators: "",
				prefLabelLg1: 'The property <strong>Intitulé</strong> is required.',
				prefLabelLg2: '',
			},
		});
	});
	it('should return an error if the prefLabelLg2 is not defined', () => {
		expect(validate({ prefLabelLg1: 'prefLabelLg1', prefLabelLg2: '', creators: ['c'] })).toEqual({
			errorMessage: ['The property <strong>Title</strong> is required.'],
			fields: {
				creators: "",
				prefLabelLg1: "",
				prefLabelLg2: "The property <strong>Title</strong> is required.",
			},
		});
	});
	it('should return an error if the creators is not defined', () => {
		expect(validate({ prefLabelLg1: 'prefLabelLg1',  prefLabelLg2: 'prefLabelLg2' })).toEqual({
			errorMessage: ['The property <strong>Owner</strong> is required.'],
			fields: {
				creators: "The property <strong>Owner</strong> is required.",
				prefLabelLg1: "",
				prefLabelLg2: "",
			},
		});
	});
	it('should return an error if the creators is an empty array', () => {
		expect(validate({ prefLabelLg1: 'prefLabelLg1',  prefLabelLg2: 'prefLabelLg2', creators: [] })).toEqual({
			errorMessage: ['The property <strong>Owner</strong> is required.'],
			fields: {
				creators: "The property <strong>Owner</strong> is required.",
				prefLabelLg1: "",
				prefLabelLg2: "",
			},
		});
	});
	it('should return no error', () => {
		expect(
			validate({ creators: ['a'], prefLabelLg1: 'prefLabelLg1', prefLabelLg2: 'prefLabelLg2' })
		).toEqual({
			errorMessage: [],
			fields: {
				creators: "",
				prefLabelLg1: "",
				prefLabelLg2: "",
			},
		});
	});
});
