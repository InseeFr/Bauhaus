import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import * as utils from '../../utils';
import { generateSimsBeforeSubmit } from './index';

describe('generateSimsBeforeSubmit', () => {
	beforeEach(() => {
		vi.mock('../../utils', () => ({
			getParentIdName: vi.fn(),
		}));
	});

	it('should generate the correct payload for CREATE mode', () => {
		(utils.getParentIdName as Mock).mockReturnValue('parentId');

		const result = generateSimsBeforeSubmit(
			{
				id: '123',
				labelLg1: 'Label 1',
				labelLg2: 'Label 2',
				created: '2023-01-01',
			},
			'operation',
			'parent123',
			{ rubric1: 'value1' },
		);

		expect(result).toEqual({
			id: '123',
			labelLg1: 'Label 1',
			labelLg2: 'Label 2',
			parentId: 'parent123',
			created: '2023-01-01',
			rubrics: { rubric1: 'value1' },
		});
	});

	it('should use the correct parent ID name based on parent type', () => {
		(utils.getParentIdName as Mock).mockReturnValue('idOperation');

		const result = generateSimsBeforeSubmit(
			{
				id: '123',
				labelLg1: 'Label 1',
				labelLg2: 'Label 2',
				created: '2023-01-01',
			},
			'indicator',
			'parent789',
			{ rubric3: 'value3' },
		);

		expect(result.idOperation).toBe('parent789');
		expect(utils.getParentIdName).toHaveBeenCalledWith('indicator');
	});
});
