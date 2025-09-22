import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { Component as Layout } from './layout';
import { useTheme } from '../../utils/hooks/useTheme';

vi.mock('../../utils/hooks/useTheme', () => ({
	useTheme: vi.fn(),
}));

vi.mock('../menu', () => ({
	Menu: () => <nav data-testid="ddi-menu">DDI Menu</nav>,
}));

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		Outlet: () => <div data-testid="outlet">Page Content</div>,
	};
});

describe('Layout Component', () => {
	it('should render Menu and Outlet', () => {
		render(
			<MemoryRouter>
				<Layout />
			</MemoryRouter>,
		);

		expect(screen.getByTestId('ddi-menu')).toBeInTheDocument();
		expect(screen.getByTestId('outlet')).toBeInTheDocument();
	});

	it('should apply DDI theme', () => {
		render(
			<MemoryRouter>
				<Layout />
			</MemoryRouter>,
		);

		expect(vi.mocked(useTheme)).toHaveBeenCalledWith('ddi');
	});

	it('should have correct layout structure', () => {
		render(
			<MemoryRouter>
				<Layout />
			</MemoryRouter>,
		);

		const container = screen.getByTestId('outlet').parentElement;
		expect(container).toHaveClass('container');

		const menu = screen.getByTestId('ddi-menu');
		const outlet = screen.getByTestId('outlet');

		expect(menu).toBeInTheDocument();
		expect(outlet).toBeInTheDocument();
	});

	it('should render menu before content', () => {
		render(
			<MemoryRouter>
				<Layout />
			</MemoryRouter>,
		);

		const menu = screen.getByTestId('ddi-menu');
		const outlet = screen.getByTestId('outlet');

		expect(menu.compareDocumentPosition(outlet)).toBe(
			Node.DOCUMENT_POSITION_FOLLOWING,
		);
	});
});
