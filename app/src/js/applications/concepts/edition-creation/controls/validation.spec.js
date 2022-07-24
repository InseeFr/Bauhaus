import validate, { scndWithoutFirst } from './validation';

describe('second without first', () => {
	it('returns true if the first argument is empty but the second one is not empty', () => {
		expect(scndWithoutFirst('', 'hello')).toBe(true);
	});

	it('returns false if both arguments are empty', () => {
		expect(scndWithoutFirst('', '')).toBe(false);
	});

	it('returns false if the first argumnent is not empty and the second argument is empty', () => {
		expect(scndWithoutFirst('hello', '')).toBe(false);
	});
});

describe('validate', () => {
	it('should return duplicatedLabel', () => {
		expect(
			validate(
				{
					prefLabelLg1: 'prefLabelLg1',
				},
				{
					prefLabelLg1: 'prefLabelLg2',
				},
				[],
				[
					{
						label: 'prefLabelLg2',
					},
				]
			)
		).toBe('This label already exists');
	});

	it('should return incompleteConcept if prefLabelLg1 is missing', () => {
		expect(
			validate(
				{
					prefLabelLg1: 'prefLabelLg1',
				},
				{
					prefLabelLg1: '',
					creator: 'creator',
					disseminationStatus: 'disseminationStatus',
				},
				[],
				[
					{
						label: 'prefLabelLg2',
					},
				]
			)
		).toBe('Complete required fields in order to save this concept');
	});
	it('should return incompleteConcept if creator is missing', () => {
		expect(
			validate(
				{
					prefLabelLg1: 'prefLabelLg1',
				},
				{
					prefLabelLg1: 'prefLabelLg1',
					disseminationStatus: 'disseminationStatus',
				},
				[],
				[
					{
						label: 'prefLabelLg2',
					},
				]
			)
		).toBe('Complete required fields in order to save this concept');
	});
	it('should return incompleteConcept if disseminationStatus is missing', () => {
		expect(
			validate(
				{
					prefLabelLg1: 'prefLabelLg1',
				},
				{
					prefLabelLg1: 'prefLabelLg1',
					creator: 'creator',
				},
				[],
				[
					{
						label: 'prefLabelLg2',
					},
				]
			)
		).toBe('Complete required fields in order to save this concept');
	});
	it('should return emptyDefinitionLg1', () => {
		expect(
			validate(
				{
					prefLabelLg1: 'prefLabelLg1',
				},
				{
					prefLabelLg1: 'prefLabelLg1',
					creator: 'creator',
					disseminationStatus: 'disseminationStatus',
				},
				[],
				[
					{
						label: 'prefLabelLg2',
					},
				]
			)
		).toBe('The concept must have a definition');
	});
	it('should return emptyScopeNoteLg1', () => {
		expect(
			validate(
				{
					prefLabelLg1: 'prefLabelLg1',
				},
				{
					prefLabelLg1: 'prefLabelLg1',
					creator: 'creator',
					disseminationStatus: 'Public',
				},
				{
					definitionLg1: 'definitionLg1',
				},
				[
					{
						label: 'prefLabelLg2',
					},
				]
			)
		).toBe(
			'As dissemination status is public, short definition has to be completed'
		);
	});
	it('should return hasScopeNoteLg2NotLg1', () => {
		expect(
			validate(
				{
					prefLabelLg1: 'prefLabelLg1',
				},
				{
					prefLabelLg1: 'prefLabelLg1',
					creator: 'creator',
					disseminationStatus: 'Private',
				},
				{
					definitionLg1: 'definitionLg1',
					scopeNoteLg2: 'scopeNoteLg1',
				},
				[
					{
						label: 'prefLabelLg2',
					},
				]
			)
		).toBe('The short definition can only be completed in the second language');
	});
	it('should return tooLongScopeNote if scopeNoteLg1 is too long', () => {
		expect(
			validate(
				{
					prefLabelLg1: 'prefLabelLg1',
				},
				{
					prefLabelLg1: 'prefLabelLg1',
					creator: 'creator',
					disseminationStatus: 'Private',
				},
				{
					definitionLg1: 'definitionLg1',
					scopeNoteLg1: 'scopeNoteLg1',
					scopeNoteLg2: 's',
				},
				[
					{
						label: 'prefLabelLg2',
					},
				],
				2
			)
		).toBe('Short definition is limited to 2 characters');
	});
	it('should return tooLongScopeNote if scopeNoteLg2 is too long', () => {
		expect(
			validate(
				{
					prefLabelLg1: 'prefLabelLg1',
				},
				{
					prefLabelLg1: 'prefLabelLg1',
					creator: 'creator',
					disseminationStatus: 'Private',
				},
				{
					definitionLg1: 'definitionLg1',
					scopeNoteLg1: 's',
					scopeNoteLg2: 'scopeNoteLg1',
				},
				[
					{
						label: 'prefLabelLg2',
					},
				],
				2
			)
		).toBe('Short definition is limited to 2 characters');
	});
	it('should return hasEditorialNoteLg2NotLg1', () => {
		expect(
			validate(
				{
					prefLabelLg1: 'prefLabelLg1',
				},
				{
					prefLabelLg1: 'prefLabelLg1',
					creator: 'creator',
					disseminationStatus: 'Private',
				},
				{
					definitionLg1: 'definitionLg1',
					scopeNoteLg1: 's',
					scopeNoteLg2: 's',
					editorialNoteLg2: 'editorialNoteLg2',
				},
				[
					{
						label: 'prefLabelLg2',
					},
				],
				2
			)
		).toBe('The editorial note can only be completed in the second language');
	});
	it('should return hasChangeNoteLg2NotLg1', () => {
		expect(
			validate(
				{
					prefLabelLg1: 'prefLabelLg1',
				},
				{
					prefLabelLg1: 'prefLabelLg1',
					creator: 'creator',
					disseminationStatus: 'Private',
				},
				{
					definitionLg1: 'definitionLg1',
					scopeNoteLg1: 's',
					scopeNoteLg2: 's',
					changeNoteLg2: 'changeNoteLg2',
				},
				[
					{
						label: 'prefLabelLg2',
					},
				],
				2
			)
		).toBe('The change note can only be completed in the second language');
	});
});
