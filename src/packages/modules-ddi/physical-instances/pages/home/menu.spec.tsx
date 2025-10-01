import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HomePageMenu } from './menu';

vi.mock('@components/new-button', () => ({
	MasculineButton: ({ action, component }: any) => (
		<button type="button" onClick={action} data-component={component}>
			Nouveau
		</button>
	),
}));

vi.mock('@components/vertical-menu', () => ({
	VerticalMenu: ({ children }: any) => (
		<div data-testid="vertical-menu">{children}</div>
	),
}));

vi.mock('../../../../auth/components/auth', () => ({
	HasAccess: ({ children, module, privilege }: any) => (
		<div data-testid="has-access" data-module={module} data-privilege={privilege}>
			{children}
		</div>
	),
}));

describe('HomePageMenu', () => {
	const mockOnCreate = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render the vertical menu', () => {
		render(<HomePageMenu onCreate={mockOnCreate} />);

		expect(screen.getByTestId('vertical-menu')).toBeInTheDocument();
	});

	it('should render HasAccess with correct module and privilege', () => {
		render(<HomePageMenu onCreate={mockOnCreate} />);

		const hasAccess = screen.getByTestId('has-access');
		expect(hasAccess).toHaveAttribute('data-module', 'DDI_PHYSICALINSTANCE');
		expect(hasAccess).toHaveAttribute('data-privilege', 'CREATE');
	});

	it('should render MasculineButton inside HasAccess', () => {
		render(<HomePageMenu onCreate={mockOnCreate} />);

		const button = screen.getByText('Nouveau');
		expect(button).toBeInTheDocument();
		expect(button).toHaveAttribute('data-component', 'button');
	});

	it('should call onCreate when button is clicked', () => {
		render(<HomePageMenu onCreate={mockOnCreate} />);

		const button = screen.getByText('Nouveau');
		fireEvent.click(button);

		expect(mockOnCreate).toHaveBeenCalledTimes(1);
	});

	it('should pass onCreate as action prop to MasculineButton', () => {
		render(<HomePageMenu onCreate={mockOnCreate} />);

		const button = screen.getByText('Nouveau');
		fireEvent.click(button);

		expect(mockOnCreate).toHaveBeenCalled();
	});

	it('should have correct component structure', () => {
		render(<HomePageMenu onCreate={mockOnCreate} />);

		const verticalMenu = screen.getByTestId('vertical-menu');
		const hasAccess = screen.getByTestId('has-access');
		const button = screen.getByText('Nouveau');

		expect(verticalMenu).toContainElement(hasAccess);
		expect(hasAccess).toContainElement(button);
	});
});
