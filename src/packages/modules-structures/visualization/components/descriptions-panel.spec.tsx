import React from 'react';
import { render, screen } from '@testing-library/react';
import { DescriptionsPanel } from './descriptions-panel';
import { D1 } from '../../../deprecated-locales';

// Mock de useSecondLang
jest.mock('../../../redux/second-lang', () => ({
	useSecondLang: jest.fn(),
}));

describe('DescriptionsPanel', () => {
	const mockDescriptionLg1 = 'Description in first language';
	const mockDescriptionLg2 = 'Description in second language';
	const mockUseSecondLang = jest.requireMock(
		'../../../redux/second-lang'
	).useSecondLang;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should display the first language description when secondLang is false', () => {
		mockUseSecondLang.mockReturnValue(false);

		render(
			<DescriptionsPanel
				descriptionLg1={mockDescriptionLg1}
				descriptionLg2={mockDescriptionLg2}
			/>
		);

		const titleLg1 = screen.getByText(D1.descriptionTitle);
		const descriptionLg1 = screen.getByText(mockDescriptionLg1);

		expect(titleLg1.innerHTML).toContain(D1.descriptionTitle);
		expect(descriptionLg1.innerHTML).toContain(mockDescriptionLg1);

		expect(screen.queryByText(mockDescriptionLg2)).toBeNull();
	});

	fit('should display both descriptions when secondLang is true', () => {
		mockUseSecondLang.mockReturnValue(true);

		render(
			<DescriptionsPanel
				descriptionLg1={mockDescriptionLg1}
				descriptionLg2={mockDescriptionLg2}
			/>
		);

		screen.getByText(mockDescriptionLg1);
		screen.getByText(mockDescriptionLg2);
	});
});
