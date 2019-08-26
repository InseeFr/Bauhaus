import { validate } from './validation';

describe('validation operations', () => {
	it('should return an error if the prefLabelLg1 is not defined', () => {
		expect(
			validate({ prefLabelLg2: 'prefLabelLg2', series: 'series' })
		).toEqual({
			errorMessage: 'The title is required',
			fields: {
				series: false,
				prefLabelLg1: true,
				prefLabelLg2: false,
			},
		});
	});
	it('should return an error if the prefLabelLg2 is not defined', () => {
		expect(
			validate({ prefLabelLg1: 'prefLabelLg1', series: 'series' })
		).toEqual({
			errorMessage: 'The title is required',
			fields: {
				series: false,
				prefLabelLg1: false,
				prefLabelLg2: true,
			},
		});
	});
	it('should return an error if the series is not defined', () => {
		expect(
			validate({ prefLabelLg1: 'prefLabelLg1', prefLabelLg2: 'prefLabelLg2' })
		).toEqual({
			errorMessage: 'The series is required',
			fields: {
				series: true,
				prefLabelLg1: false,
				prefLabelLg2: false,
			},
		});
	});
	it('should not return any errors', () => {
		expect(
			validate({
				prefLabelLg1: 'prefLabelLg1',
				prefLabelLg2: 'prefLabelLg2',
				series: 'series',
			})
		).toEqual({
			errorMessage: '',
			fields: {
				series: false,
				prefLabelLg1: false,
				prefLabelLg2: false,
			},
		});
	});
});
