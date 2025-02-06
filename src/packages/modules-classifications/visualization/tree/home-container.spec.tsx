import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, Mock, vi } from 'vitest';

import { ClassificationsApi } from '@sdk/classification';

import { useClassificationsItem } from '@utils/hooks/classifications';
import { useSecondLang } from '@utils/hooks/second-lang';

import { Component } from './home-container';

vi.mock('@utils/hooks/classifications', () => ({
	useClassificationsItem: vi.fn(),
}));

vi.mock('@utils/hooks/second-lang', () => ({
	useSecondLang: vi.fn(),
}));

vi.mock('@sdk/classification', () => ({
	ClassificationsApi: {
		getClassificationGeneral: vi.fn(),
	},
}));

describe('Component', () => {
	it('display the loader', () => {
		(useClassificationsItem as Mock).mockReturnValue({
			isLoading: true,
			data: [],
		});
		(useSecondLang as Mock).mockReturnValue([false]);
		(ClassificationsApi.getClassificationGeneral as Mock).mockResolvedValue(
			null,
		);

		render(
			<MemoryRouter initialEntries={['/123']}>
				<Routes>
					<Route path="/:id" element={<Component />} />
				</Routes>
			</MemoryRouter>,
		);

		expect(screen.getByText('Loading in progress...')).toBeInTheDocument();
	});

	it('display the ClassificationTree component', async () => {
		(useClassificationsItem as Mock).mockReturnValue({
			isLoading: false,
			data: [
				{ id: '1', labelLg1: 'Label1', labelLg2: 'Label1-2', parent: null },
			],
		});
		(useSecondLang as Mock).mockReturnValue([false]);
		(ClassificationsApi.getClassificationGeneral as Mock).mockResolvedValue({
			prefLabelLg1: 'General Label 1',
			prefLabelLg2: 'General Label 2',
		});

		render(
			<MemoryRouter initialEntries={['/123']}>
				<Routes>
					<Route path="/:id" element={<Component />} />
				</Routes>
			</MemoryRouter>,
		);

		waitFor(() => {
			expect(screen.getByText('General Label 1')).toBeInTheDocument();
		});
	});
});
