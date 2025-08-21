import { Rubric, Sims } from '../../model/Sims';
import { rangeType } from '../utils/msd';
import { CREATE, DUPLICATE } from './constant';
import {
	getParentId,
	getParentIdName,
	getParentType,
	getParentUri,
	hasLabelLg2,
	isOpen,
	removeRubricsWhenDuplicate,
	toggleOpen,
} from './utils';

const { RICH_TEXT, TEXT, REPORTED_ATTRIBUTE } = rangeType;

vi.mock('@utils/html-utils', () => ({
	editorStateFromMd: vi.fn((text) => `EditorState(${text})`),
}));

describe('isOpen', () => {
	beforeEach(() => {
		localStorage.setItem(
			'HELP_COLLAPSED',
			JSON.stringify({
				2: true,
				3: false,
			}),
		);
	});
	it('should return false as a default value', () => {
		const input = '1';
		const output = isOpen(input);
		expect(output).toBeFalsy();
	});
	it('should return false if the item is closed', () => {
		const input = '3';
		const output = isOpen(input);
		expect(output).toBeFalsy();
	});

	it('should return true if the item is opened', () => {
		const input = '2';
		const output = isOpen(input);
		expect(output).toBeTruthy();
	});
});

describe('toggleOpen', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('should toggle the state from false to true when it is not set', () => {
		toggleOpen('test-id');
		const storedData = JSON.parse(
			localStorage.getItem('HELP_COLLAPSED') || '{}',
		);
		expect(storedData['test-id']).toBe(true);
	});

	it('should toggle the state from true to false', () => {
		localStorage.setItem('HELP_COLLAPSED', JSON.stringify({ 'test-id': true }));
		toggleOpen('test-id');
		const storedData = JSON.parse(
			localStorage.getItem('HELP_COLLAPSED') || '{}',
		);
		expect(storedData['test-id']).toBe(false);
	});

	it('should not affect other ids in the storage', () => {
		localStorage.setItem(
			'HELP_COLLAPSED',
			JSON.stringify({ 'other-id': true }),
		);
		toggleOpen('test-id');
		const storedData = JSON.parse(
			localStorage.getItem('HELP_COLLAPSED') || '{}',
		);
		expect(storedData['other-id']).toBe(true);
		expect(storedData['test-id']).toBe(true);
	});

	it('should handle empty localStorage gracefully', () => {
		toggleOpen('test-id');
		const storedData = JSON.parse(
			localStorage.getItem('HELP_COLLAPSED') || '{}',
		);
		expect(storedData['test-id']).toBe(true);
	});
});

describe('hasLabelLg2', () => {
	it('should return true if the section is a TEXT', () => {
		const input = { rangeType: TEXT } as unknown as Rubric;
		expect(hasLabelLg2(input)).toBeTruthy();
	});
	it('should return true if the section is a RICH_TEXT', () => {
		const input = { rangeType: RICH_TEXT } as unknown as Rubric;
		expect(hasLabelLg2(input)).toBeTruthy();
	});
	it('should return false if the section is a REPORTED_ATTRIBUTE', () => {
		const input = { rangeType: REPORTED_ATTRIBUTE } as unknown as Rubric;
		expect(hasLabelLg2(input)).toBeFalsy();
	});
});

describe('getParentUri', () => {
	it('should return a uri of an operation', () => {
		expect(getParentUri({ idOperation: '1' } as unknown as Sims)).toBe(
			`/operations/operation/1`,
		);
	});
	it('should return a uri of an series', () => {
		expect(getParentUri({ idSeries: '1' } as unknown as Sims)).toBe(
			`/operations/series/1`,
		);
	});
	it('should return a uri of an indicator', () => {
		expect(getParentUri({ idIndicator: '1' } as unknown as Sims)).toBe(
			`/operations/indicator/1`,
		);
	});
	it('should return undefined', () => {
		expect(getParentUri({} as unknown as Sims)).toBeUndefined();
	});
});

describe('getParentType', () => {
	it('should return "operation" when idOperation is defined', () => {
		const sims = {
			idOperation: '123',
			idSeries: null,
			idIndicator: null,
		} as unknown as Sims;
		const result = getParentType(sims);
		expect(result).toBe('operation');
	});

	it('should return "series" when idSeries is defined and idOperation is undefined', () => {
		const sims = {
			idOperation: null,
			idSeries: '456',
			idIndicator: null,
		} as unknown as Sims;
		const result = getParentType(sims);
		expect(result).toBe('series');
	});

	it('should return "indicator" when idIndicator is defined and idOperation and idSeries are undefined', () => {
		const sims = {
			idOperation: null,
			idSeries: null,
			idIndicator: '789',
		} as unknown as Sims;
		const result = getParentType(sims);
		expect(result).toBe('indicator');
	});

	it('should return undefined when none of the ids are defined', () => {
		const sims = {
			idOperation: null,
			idSeries: null,
			idIndicator: null,
		} as unknown as Sims;
		const result = getParentType(sims);
		expect(result).toBeUndefined();
	});

	it('should prioritize "operation" over "series" and "indicator" when all are defined', () => {
		const sims = {
			idOperation: '123',
			idSeries: '456',
			idIndicator: '789',
		} as unknown as Sims;
		const result = getParentType(sims);
		expect(result).toBe('operation');
	});

	it('should prioritize "series" over "indicator" when both are defined but idOperation is undefined', () => {
		const sims = {
			idOperation: null,
			idSeries: '456',
			idIndicator: '789',
		} as unknown as Sims;
		const result = getParentType(sims);
		expect(result).toBe('series');
	});
});

describe('getParentId', () => {
	it('should return idOperation when it is defined', () => {
		const sims = {
			idOperation: '123',
			idSeries: null,
			idIndicator: null,
		} as unknown as Sims;
		const result = getParentId(sims);
		expect(result).toBe('123');
	});

	it('should return idSeries when idOperation is undefined and idSeries is defined', () => {
		const sims = {
			idOperation: null,
			idSeries: '456',
			idIndicator: null,
		} as unknown as Sims;
		const result = getParentId(sims);
		expect(result).toBe('456');
	});

	it('should return idIndicator when idOperation and idSeries are undefined and idIndicator is defined', () => {
		const sims = {
			idOperation: null,
			idSeries: null,
			idIndicator: '789',
		} as unknown as Sims;
		const result = getParentId(sims);
		expect(result).toBe('789');
	});

	it('should return null when none of the ids are defined', () => {
		const sims = {
			idOperation: null,
			idSeries: null,
			idIndicator: null,
		} as unknown as Sims;
		const result = getParentId(sims);
		expect(result).toBeNull();
	});

	it('should prioritize idOperation over idSeries and idIndicator when all are defined', () => {
		const sims = {
			idOperation: '123',
			idSeries: '456',
			idIndicator: '789',
		} as unknown as Sims;
		const result = getParentId(sims);
		expect(result).toBe('123');
	});

	it('should prioritize idSeries over idIndicator when both are defined but idOperation is undefined', () => {
		const sims = {
			idOperation: null,
			idSeries: '456',
			idIndicator: '789',
		} as unknown as Sims;
		const result = getParentId(sims);
		expect(result).toBe('456');
	});
});

describe('getParentIdName', () => {
	it('should return "idOperation" when parentType is "operation"', () => {
		const result = getParentIdName('operation');
		expect(result).toBe('idOperation');
	});

	it('should return "idSeries" when parentType is "series"', () => {
		const result = getParentIdName('series');
		expect(result).toBe('idSeries');
	});

	it('should return "idIndicator" when parentType is "indicator"', () => {
		const result = getParentIdName('indicator');
		expect(result).toBe('idIndicator');
	});

	it('should return undefined for invalid parentType', () => {
		const result = getParentIdName('unknown' as any); // Casté pour tester les cas non pris en charge
		expect(result).toBeUndefined();
	});
});

describe('removeRubricsWhenDuplicate', () => {
	it('should remove rubrics in the blacklist when mode is DUPLICATE', () => {
		const rubrics = {
			'I.6.4': { labelLg1: 'Text 1', labelLg2: 'Text 2', rangeType: 'PLAIN' },
			'A.1.1': { labelLg1: 'Other 1', labelLg2: 'Other 2', rangeType: 'PLAIN' },
		} as unknown as Record<string, Rubric>;
		const result = removeRubricsWhenDuplicate(DUPLICATE, rubrics);
		expect(result).toEqual({
			'A.1.1': { labelLg1: 'Other 1', labelLg2: 'Other 2', rangeType: 'PLAIN' },
		});
	});

	it('should keep all rubrics when mode is not DUPLICATE', () => {
		const rubrics = {
			'I.6.4': { labelLg1: 'Text 1', labelLg2: 'Text 2', rangeType: 'PLAIN' },
			'A.1.1': { labelLg1: 'Other 1', labelLg2: 'Other 2', rangeType: 'PLAIN' },
		} as unknown as Record<string, Rubric>;
		const result = removeRubricsWhenDuplicate(CREATE, rubrics);
		expect(result).toEqual(rubrics);
	});

	it('should transform rich text labels using editorStateFromMd', () => {
		const rubrics = {
			'A.1.1': {
				labelLg1: 'Rich Text 1',
				labelLg2: 'Rich Text 2',
				rangeType: 'RICH_TEXT',
			},
		} as unknown as Record<string, Rubric>;
		const result = removeRubricsWhenDuplicate(CREATE, rubrics);
		expect(result).toEqual({
			'A.1.1': {
				labelLg1: 'EditorState(Rich Text 1)',
				labelLg2: 'EditorState(Rich Text 2)',
				rangeType: 'RICH_TEXT',
			},
		});
	});

	it('should handle an empty rubrics object gracefully', () => {
		const result = removeRubricsWhenDuplicate(DUPLICATE, {});
		expect(result).toEqual({});
	});

	it('should handle undefined rubrics gracefully', () => {
		const result = removeRubricsWhenDuplicate(DUPLICATE);
		expect(result).toEqual({});
	});
});
