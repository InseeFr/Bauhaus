import validator, {
	scndWithoutFirst,
	checkPrefLabelLg1Existing,
} from './validation';
import { HTMLUtils } from '../../../../utils';
import D, { D1 } from '../../../../i18n';

jest.mock('../../../../utils', () => ({
	HTMLUtils: {
		htmlIsEmpty: jest.fn(),
		htmlLength: jest.fn(),
	},
}));

describe('scndWithoutFirst', () => {
	it('should return true when second is not empty and first is empty', () => {
		HTMLUtils.htmlIsEmpty.mockImplementation((html) => html === '');

		const result = scndWithoutFirst('', 'not empty');
		expect(result).toBe(true);
	});

	it('should return false when first is not empty', () => {
		HTMLUtils.htmlIsEmpty.mockImplementation((html) => html === '');

		const result = scndWithoutFirst('not empty', 'not empty');
		expect(result).toBe(false);
	});

	it('should return false when second is empty', () => {
		HTMLUtils.htmlIsEmpty.mockImplementation((html) => html === '');

		const result = scndWithoutFirst('', '');
		expect(result).toBe(false);
	});
});

describe('checkPrefLabelLg1Existing', () => {
	it('should return true when prefLabelLg1 exists in concepts and is different from initialPrefLabelFr', () => {
		const concepts = [{ label: 'existingLabel' }];
		const result = checkPrefLabelLg1Existing(
			concepts,
			'existingLabel',
			'initialLabel'
		);
		expect(result).toBe(true);
	});

	it('should return false when prefLabelLg1 is the same as initialPrefLabelFr', () => {
		const concepts = [{ label: 'existingLabel' }];
		const result = checkPrefLabelLg1Existing(
			concepts,
			'initialLabel',
			'initialLabel'
		);
		expect(result).toBe(false);
	});

	it('should return false when prefLabelLg1 does not exist in concepts', () => {
		const concepts = [{ label: 'otherLabel' }];
		const result = checkPrefLabelLg1Existing(
			concepts,
			'nonExistingLabel',
			'initialLabel'
		);
		expect(result).toBe(false);
	});
});

describe('validator', () => {
	it('should return errors for missing mandatory fields and duplicated label', () => {
		HTMLUtils.htmlIsEmpty.mockReturnValue(true);
		HTMLUtils.htmlLength.mockReturnValue(0);

		const oldGeneral = { prefLabelLg1: 'oldLabel' };
		const newGeneral = {
			prefLabelLg1: '',
			creator: '',
			disseminationStatus: 'Public',
		};
		const notes = {
			definitionLg1: '',
			scopeNoteLg1: '',
			scopeNoteLg2: '',
			editorialNoteLg1: '',
			editorialNoteLg2: '',
			changeNoteLg1: '',
			changeNoteLg2: '',
		};
		const conceptsWithLinks = [{ label: 'duplicatedLabel' }];
		const maxLengthScopeNote = 100;

		const result = validator(
			oldGeneral,
			newGeneral,
			notes,
			conceptsWithLinks,
			maxLengthScopeNote
		);

		expect(result.errorMessage).toContain(D.mandatoryProperty(D1.labelTitle));
		expect(result.errorMessage).toContain(D.mandatoryProperty(D.creatorTitle));
		expect(result.errorMessage).toContain(D.emptyDefinitionLg1);
		expect(result.errorMessage).toContain(D.emptyScopeNoteLg1);

		expect(result.fields.prefLabelLg1).toBe(D.mandatoryProperty(D1.labelTitle));
		expect(result.fields.creator).toBe(D.mandatoryProperty(D.creatorTitle));
		expect(result.fields.definitionLg1).toBe(D.emptyDefinitionLg1);
		expect(result.fields.scopeNoteLg1).toBe(D.emptyScopeNoteLg1);
	});

	it('should return error for too long scope notes', () => {
		HTMLUtils.htmlIsEmpty.mockReturnValue(false);
		HTMLUtils.htmlLength.mockImplementation((html) => html.length);

		const oldGeneral = { prefLabelLg1: 'oldLabel' };
		const newGeneral = {
			prefLabelLg1: 'newLabel',
			creator: 'creator',
			disseminationStatus: 'Public',
		};
		const notes = {
			definitionLg1: 'definition',
			scopeNoteLg1: 'a'.repeat(101),
			scopeNoteLg2: 'a'.repeat(101),
			editorialNoteLg1: '',
			editorialNoteLg2: '',
			changeNoteLg1: '',
			changeNoteLg2: '',
		};
		const conceptsWithLinks = [{ label: 'existingLabel' }];
		const maxLengthScopeNote = 100;

		const result = validator(
			oldGeneral,
			newGeneral,
			notes,
			conceptsWithLinks,
			maxLengthScopeNote
		);

		expect(result.errorMessage).toContain(
			D.tooLongScopeNote(maxLengthScopeNote)
		);
		expect(result.fields.scopeNoteLg1).toBe(
			D.tooLongScopeNote(maxLengthScopeNote)
		);
		expect(result.fields.scopeNoteLg2).toBe(
			D.tooLongScopeNote(maxLengthScopeNote)
		);
	});

	it('should pass validation for valid input', () => {
		HTMLUtils.htmlIsEmpty.mockReturnValue(false);
		HTMLUtils.htmlLength.mockImplementation((html) => html.length);

		const oldGeneral = { prefLabelLg1: 'oldLabel' };
		const newGeneral = {
			prefLabelLg1: 'newLabel',
			creator: 'creator',
			disseminationStatus: 'Public',
		};
		const notes = {
			definitionLg1: 'definition',
			scopeNoteLg1: 'scopeNote1',
			scopeNoteLg2: 'scopeNote2',
			editorialNoteLg1: 'editorialNote1',
			editorialNoteLg2: 'editorialNote2',
			changeNoteLg1: 'changeNote1',
			changeNoteLg2: 'changeNote2',
		};
		const conceptsWithLinks = [{ label: 'existingLabel' }];
		const maxLengthScopeNote = 100;

		const result = validator(
			oldGeneral,
			newGeneral,
			notes,
			conceptsWithLinks,
			maxLengthScopeNote
		);

		expect(result.errorMessage).toHaveLength(0);
		expect(result.fields).toEqual({});
	});
});
