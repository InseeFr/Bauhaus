import { fireEvent, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { ValidationState } from '@components/status';

import { OperationsApi } from '@sdk/operations-api';

import { renderWithAppContext } from '../../../tests-utils/render';
import OperationsFamilyEdition from './edition';

vi.mock('@sdk/operations-api', () => ({
	OperationsApi: {
		createFamily: vi.fn(),
		updateFamily: vi.fn(),
	},
}));

const mockGoBack = vi.fn();

describe('OperationsFamilyEdition', () => {
	const defaultProps = {
		id: '1',
		family: {
			id: '1',
			prefLabelLg1: 'Test Label 1',
			prefLabelLg2: 'Test Label 2',
			themeLg1: 'Theme 1',
			themeLg2: 'Theme 2',
			abstractLg1: 'Abstract 1',
			abstractLg2: 'Abstract 2',
			validationState: 'Unpublished' as ValidationState,
			series: [],
			created: '',
			modified: '',
		},
		goBack: mockGoBack,
	};

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should render the component correctly', () => {
		renderWithAppContext(<OperationsFamilyEdition {...defaultProps} />);

		screen.getByDisplayValue('Test Label 1');
		screen.getByDisplayValue('Test Label 2');
		screen.getByDisplayValue('Theme 1');
		screen.getByDisplayValue('Theme 2');
	});

	it('should update state when input values change', () => {
		renderWithAppContext(<OperationsFamilyEdition {...defaultProps} />);

		const input = screen.getByDisplayValue('Test Label 1') as HTMLInputElement;
		fireEvent.change(input, { target: { value: 'Updated Label 1' } });

		expect(input.value).toBe('Updated Label 1');
	});

	it('should call createFamily API on submit when creating a new family', async () => {
		const props = {
			...defaultProps,
			id: '',
			family: { ...defaultProps.family, id: '' },
		};
		OperationsApi.createFamily.mockResolvedValueOnce('new-id');

		renderWithAppContext(<OperationsFamilyEdition {...props} />);

		fireEvent.click(screen.getByRole('button', { name: /Save/i }));

		await waitFor(() => {
			expect(OperationsApi.createFamily).toHaveBeenCalledWith(props.family);
			expect(mockGoBack).toHaveBeenCalledWith(
				'/operations/family/new-id',
				true,
			);
		});
	});

	it('should call updateFamily API on submit when updating an existing family', async () => {
		OperationsApi.updateFamily.mockResolvedValueOnce();

		renderWithAppContext(<OperationsFamilyEdition {...defaultProps} />);

		fireEvent.click(screen.getByRole('button', { name: /Save/i }));

		await waitFor(() => {
			expect(OperationsApi.updateFamily).toHaveBeenCalledWith(
				defaultProps.family,
			);
			expect(mockGoBack).toHaveBeenCalledWith('/operations/family/1', false);
		});
	});

	it('should display server-side error if API call fails', async () => {
		OperationsApi.updateFamily.mockRejectedValueOnce('Server error');

		renderWithAppContext(<OperationsFamilyEdition {...defaultProps} />);

		fireEvent.click(screen.getByRole('button', { name: /Save/i }));

		await waitFor(() => {
			screen.getByText('Server error');
		});
	});
});
