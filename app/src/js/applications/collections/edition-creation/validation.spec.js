import { validate } from './validation';

describe('validation', function () {
	it('message should say incomplete collection', function () {
		expect(
			validate(
				{
					id: 'id',
					prefLabelLg1: 'prefLabelLg1',
					creator: '',
				},
				[],
				'id',
				'prefLabelLg1'
			)
		).toEqual({
			message:
				'Remplissez les champs requis pour pouvoir sauvegarder cette collection',
		});
	});
	it('message should say duplicated id', function () {
		expect(
			validate(
				{
					id: 'éxèmplê',
					prefLabelLg1: 'prefLabelLg1',
					creator: 'creator',
				},
				['exemple'],
				'id',
				'prefLabelLg1'
			)
		).toEqual({
			message: "L'identifiant choisi existe déjà",
		});
	});
	it('message should say duplicated label', function () {
		expect(
			validate(
				{
					id: 'id',
					prefLabelLg1: 'éxèmplê',
					creator: 'creator',
				},
				['exemple'],
				'id',
				'prefLabelLg1'
			)
		).toEqual({
			message: 'Le libellé choisi existe déjà',
		});
	});
	it('message should be empty', function () {
		expect(
			validate(
				{
					id: 'id',
					prefLabelLg1: 'prefLabelLg1',
					creator: 'creator',
				},
				[],
				'id',
				'prefLabelLg1'
			)
		).toEqual({
			message: '',
		});
	});
});
