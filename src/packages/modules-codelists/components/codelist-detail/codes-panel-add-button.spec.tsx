import { render, screen, fireEvent } from '@testing-library/react';
import { Mock, vi } from 'vitest';

import { ADMIN, CODELIST_CONTRIBUTOR } from '../../../auth/roles';
import { usePermission } from '../../../redux/hooks/usePermission';
import { CodesPanelAddButton } from './codes-panel-add-button';

vi.mock('../../../redux/hooks/usePermission', () => ({
	usePermission: vi.fn(),
}));

describe('CodesPanelAddButton', () => {
	const mockOnHandlePanel = vi.fn();

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should not render if codelist.lastCodeUriSegment is missing', () => {
		(usePermission as Mock).mockReturnValue({
			stamp: 'test-stamp',
			roles: [ADMIN],
		});

		render(
			<CodesPanelAddButton codelist={{}} onHandlePanel={mockOnHandlePanel} />,
		);

		expect(screen.queryByRole('button', { name: /add/i })).toBeNull();
	});

	it('should render the button if user is an admin', () => {
		(usePermission as Mock).mockReturnValue({
			stamp: 'test-stamp',
			roles: [ADMIN],
		});

		render(
			<CodesPanelAddButton
				codelist={{ lastCodeUriSegment: 'segment' }}
				onHandlePanel={mockOnHandlePanel}
			/>,
		);

		screen.getByRole('button', { name: /add/i });
	});

	it('should render the button if user has contributor rights based on stamp', () => {
		(usePermission as Mock).mockReturnValue({
			stamp: 'test-contributor',
			roles: [CODELIST_CONTRIBUTOR],
		});

		render(
			<CodesPanelAddButton
				codelist={{
					lastCodeUriSegment: 'segment',
					contributor: 'test-contributor',
				}}
				onHandlePanel={mockOnHandlePanel}
			/>,
		);

		screen.getByRole('button', { name: /add/i });
	});

	it('should not render the button if user lacks the required permissions', () => {
		(usePermission as Mock).mockReturnValue({
			stamp: 'test-stamp',
			roles: ['OTHER_ROLE'],
		});

		render(
			<CodesPanelAddButton
				codelist={{
					lastCodeUriSegment: 'segment',
					contributor: 'test-contributor',
				}}
				onHandlePanel={mockOnHandlePanel}
			/>,
		);

		expect(screen.queryByRole('button', { name: /add/i })).toBeNull();
	});

	it('should trigger onHandlePanel when the button is clicked', () => {
		(usePermission as Mock).mockReturnValue({
			stamp: 'test-contributor',
			roles: [CODELIST_CONTRIBUTOR],
		});

		render(
			<CodesPanelAddButton
				codelist={{
					lastCodeUriSegment: 'segment',
					contributor: 'test-contributor',
				}}
				onHandlePanel={mockOnHandlePanel}
			/>,
		);

		const button = screen.getByRole('button', { name: /add/i });
		fireEvent.click(button);

		expect(mockOnHandlePanel).toHaveBeenCalledTimes(1);
	});
});
