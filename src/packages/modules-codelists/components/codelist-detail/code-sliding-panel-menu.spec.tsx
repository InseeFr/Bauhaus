import { CodesList } from '@model/CodesList';
import { render, screen, fireEvent } from '@testing-library/react';
import { Mock, vi } from 'vitest';

import { ADMIN, CODELIST_CONTRIBUTOR } from '../../../auth/roles';
import { usePermission } from '../../../redux/hooks/usePermission';
import { CodeSlidingPanelMenu } from './code-sliding-panel-menu';

vi.mock('../../../redux/hooks/usePermission');

describe('CodeSlidingPanelMenu', () => {
	const mockHandleSubmit = vi.fn();
	const mockHandleBack = vi.fn();
	const codelist = { contributor: 'test-contributor' };

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders the ReturnButton', () => {
		(usePermission as Mock).mockReturnValue({ roles: [], stamp: '' });
		render(
			<CodeSlidingPanelMenu
				codelist={codelist as unknown as CodesList}
				handleSubmit={mockHandleSubmit}
				handleBack={mockHandleBack}
				creation={false}
			/>,
		);

		screen.getByRole('button', { name: /back/i });
	});

	it('renders the UpdateButton when not in creation mode and has permission', () => {
		(usePermission as Mock).mockReturnValue({
			roles: [CODELIST_CONTRIBUTOR],
			stamp: 'test-contributor',
		});

		render(
			<CodeSlidingPanelMenu
				codelist={codelist as unknown as CodesList}
				handleSubmit={mockHandleSubmit}
				handleBack={mockHandleBack}
				creation={false}
			/>,
		);

		screen.getByRole('button', { name: /update/i });
	});

	it('renders the SaveButton when in creation mode and has permission', () => {
		(usePermission as Mock).mockReturnValue({
			roles: [CODELIST_CONTRIBUTOR],
			stamp: 'test-contributor',
		});

		render(
			<CodeSlidingPanelMenu
				codelist={codelist as unknown as CodesList}
				handleSubmit={mockHandleSubmit}
				handleBack={mockHandleBack}
				creation={true}
			/>,
		);

		screen.getByRole('button', { name: /save/i });
	});

	it('does not render UpdateButton or SaveButton when user lacks permissions', () => {
		(usePermission as Mock).mockReturnValue({
			roles: [],
			stamp: 'other-contributor',
		});

		render(
			<CodeSlidingPanelMenu
				codelist={codelist as unknown as CodesList}
				handleSubmit={mockHandleSubmit}
				handleBack={mockHandleBack}
				creation={false}
			/>,
		);

		expect(screen.queryByRole('button', { name: /update/i })).toBeNull();

		render(
			<CodeSlidingPanelMenu
				codelist={codelist as unknown as CodesList}
				handleSubmit={mockHandleSubmit}
				handleBack={mockHandleBack}
				creation={false}
			/>,
		);

		expect(screen.queryByRole('button', { name: /save/i })).toBeNull();
	});

	it('renders the UpdateButton and SaveButton for admin users', () => {
		(usePermission as Mock).mockReturnValue({ roles: [ADMIN], stamp: '' });

		render(
			<CodeSlidingPanelMenu
				codelist={codelist as unknown as CodesList}
				handleSubmit={mockHandleSubmit}
				handleBack={mockHandleBack}
				creation={false}
			/>,
		);

		screen.getByRole('button', { name: /update/i });

		render(
			<CodeSlidingPanelMenu
				codelist={codelist as unknown as CodesList}
				handleSubmit={mockHandleSubmit}
				handleBack={mockHandleBack}
				creation={true}
			/>,
		);

		screen.getByRole('button', { name: /save/i });
	});

	it('triggers the appropriate actions on button clicks', () => {
		(usePermission as Mock).mockReturnValue({ roles: [ADMIN], stamp: '' });

		render(
			<CodeSlidingPanelMenu
				codelist={codelist as unknown as CodesList}
				handleSubmit={mockHandleSubmit}
				handleBack={mockHandleBack}
				creation={false}
			/>,
		);

		fireEvent.click(screen.getByRole('button', { name: /back/i }));
		expect(mockHandleBack).toHaveBeenCalled();

		fireEvent.click(screen.getByRole('button', { name: /update/i }));
		expect(mockHandleSubmit).toHaveBeenCalled();
	});
});
