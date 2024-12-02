import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { useSecondLang } from '@utils/hooks/second-lang';

import { D1 } from '../../../deprecated-locales';
import { DescriptionsPanel } from './descriptions-panel';

vi.mock('@utils/hooks/second-lang', () => ({
	useSecondLang: vi.fn(),
}));

describe('DescriptionsPanel', async () => {
	const mockDescriptionLg1 = 'Description in first language';
	const mockDescriptionLg2 = 'Description in second language';

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should display the first language description when secondLang is false', () => {
		useSecondLang.mockReturnValue([false]);

		render(
			<DescriptionsPanel
				descriptionLg1={mockDescriptionLg1}
				descriptionLg2={mockDescriptionLg2}
			/>,
		);

		const titleLg1 = screen.getByText(D1.descriptionTitle);
		const descriptionLg1 = screen.getByText(mockDescriptionLg1);

		expect(titleLg1.innerHTML).toContain(D1.descriptionTitle);
		expect(descriptionLg1.innerHTML).toContain(mockDescriptionLg1);

		expect(screen.queryByText(mockDescriptionLg2)).toBeNull();
	});

	it('should display both descriptions when secondLang is true', () => {
		useSecondLang.mockReturnValue([true]);

		render(
			<DescriptionsPanel
				descriptionLg1={mockDescriptionLg1}
				descriptionLg2={mockDescriptionLg2}
			/>,
		);

		screen.getByText(mockDescriptionLg1);
		screen.getByText(mockDescriptionLg2);
	});
});
