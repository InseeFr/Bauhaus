import buildPayload from './build-payload';

describe('build-payload', () => {
	it('CREATE', () => {
		const collection = {
			general: {
				id: 'id',
				prefLabelLg1: 'prefLabelLg1',
				prefLabelLg2: 'prefLabelLg2',
				creator: 'creator',
				contributor: 'contributor',
				descriptionLg1: 'descriptionLg1',
				descriptionLg2: 'descriptionLg2',
				created: 'created',
			},
			members: [
				{ id: '1', label: 'label1' },
				{ id: '2', label: 'label2' },
			],
		};
		const output = buildPayload(collection, 'CREATE');
		const expected = {
			id: 'id',
			prefLabelLg1: 'prefLabelLg1',
			prefLabelLg2: 'prefLabelLg2',
			creator: 'creator',
			contributor: 'contributor',
			descriptionLg1: 'descriptionLg1',
			descriptionLg2: 'descriptionLg2',
			members: ['1', '2'],
		};

		expect(output).toEqual(expected);
	});

	it('UPDATE', () => {
		const collection = {
			general: {
				id: 'id',
				prefLabelLg1: 'prefLabelLg1',
				prefLabelLg2: 'prefLabelLg2',
				creator: 'creator',
				contributor: 'contributor',
				descriptionLg1: 'descriptionLg1',
				descriptionLg2: 'descriptionLg2',
				created: 'created',
			},
			members: [
				{ id: '1', label: 'label1' },
				{ id: '2', label: 'label2' },
			],
		};
		const output = buildPayload(collection, 'UPDATE');
		const expected = {
			id: 'id',
			prefLabelLg1: 'prefLabelLg1',
			prefLabelLg2: 'prefLabelLg2',
			creator: 'creator',
			contributor: 'contributor',
			descriptionLg1: 'descriptionLg1',
			descriptionLg2: 'descriptionLg2',
			created: 'created',

			members: ['1', '2'],
		};

		expect(output).toEqual(expected);
	});
});
