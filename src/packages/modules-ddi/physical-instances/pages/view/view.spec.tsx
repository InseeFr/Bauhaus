import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Component } from './view';
import type { ReactNode } from 'react';

const mockUsePhysicalInstancesData = vi.fn();
const mockUpdatePhysicalInstance = vi.fn();
const mockConvertToDDI3 = vi.fn().mockResolvedValue('<ddi3-xml-content></ddi3-xml-content>');

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => key,
		i18n: { language: 'fr-FR' },
	}),
}));

vi.mock('react-router-dom', () => ({
	useParams: () => ({ id: 'test-id-123' }),
}));

vi.mock('../../../hooks/usePhysicalInstance', () => ({
	usePhysicalInstancesData: () => mockUsePhysicalInstancesData(),
}));

vi.mock('../../../hooks/useUpdatePhysicalInstance', () => ({
	useUpdatePhysicalInstance: () => mockUpdatePhysicalInstance(),
}));

// Mock fetch globally to intercept API calls
global.fetch = vi.fn((url) => {
	if (typeof url === 'string' && url.includes('/convert/ddi4-to-ddi3')) {
		return Promise.resolve({
			ok: true,
			text: () => mockConvertToDDI3(),
			json: () => mockConvertToDDI3(),
		} as Response);
	}
	return Promise.reject(new Error(`Unexpected fetch call to ${url}`));
}) as any;

vi.mock('primereact/progressspinner', () => ({
	ProgressSpinner: () => <div data-testid="progress-spinner">Loading...</div>,
}));

vi.mock('primereact/message', () => ({
	Message: ({ severity, text }: any) => (
		<div data-testid="message" data-severity={severity}>
			{text}
		</div>
	),
}));

vi.mock('primereact/dropdown', () => ({
	Dropdown: ({ value, options, onChange, ...props }: any) => (
		<select
			value={value}
			onChange={(e) => onChange({ value: e.target.value })}
			{...props}
		>
			{options?.map((opt: any) => (
				<option key={opt.value} value={opt.value}>
					{opt.label}
				</option>
			))}
		</select>
	),
}));

vi.mock('primereact/dialog', () => ({
	Dialog: ({ visible, children, header }: any) =>
		visible ? (
			<div role="dialog" aria-label={header}>
				<h2>{header}</h2>
				{children}
			</div>
		) : null,
}));

// Mock for file download
const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();
const mockClick = vi.fn();

global.URL.createObjectURL = mockCreateObjectURL;
global.URL.revokeObjectURL = mockRevokeObjectURL;

// Mock document.createElement to track link creation
const originalCreateElement = document.createElement.bind(document);
document.createElement = vi.fn((tagName: string) => {
	const element = originalCreateElement(tagName);
	if (tagName === 'a') {
		element.click = mockClick;
	}
	return element;
}) as any;


describe('View Component', () => {
	let queryClient: QueryClient;

	const wrapper = ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
				},
			},
		});
		vi.clearAllMocks();
		mockConvertToDDI3.mockResolvedValue('<ddi3-xml-content></ddi3-xml-content>');

		// Default mock implementation
		mockUsePhysicalInstancesData.mockReturnValue({
			data: {
				PhysicalInstance: [{ Citation: { Title: { String: { '#text': 'Test Physical Instance' } } } }],
				DataRelationship: [{ DataRelationshipName: { String: { '#text': 'Test Data Relationship' } } }],
				Variable: [],
			},
			variables: [
				{
					id: '1',
					name: 'Variable1',
					label: 'Label 1',
					type: 'Code',
					lastModified: '03/06/2024',
				},
				{
					id: '2',
					name: 'Variable2',
					label: 'Label 2',
					type: 'Numeric',
					lastModified: '03/06/2024',
				},
			],
			title: 'Test Physical Instance',
			dataRelationshipName: 'Test Data Relationship',
			isLoading: false,
			isError: false,
		});

		// Default mock for mutation
		mockUpdatePhysicalInstance.mockReturnValue({
			mutateAsync: vi.fn().mockResolvedValue({}),
			isPending: false,
			isError: false,
		});
	});

	describe('Loading state', () => {
		it('should render loading spinner when data is loading', () => {
			mockUsePhysicalInstancesData.mockReturnValue({
				variables: [],
				isLoading: true,
				isError: false,
			});

			render(<Component />, { wrapper });

			expect(screen.getByTestId('progress-spinner')).toBeInTheDocument();
			expect(
				screen.getByLabelText('Loading in progress...'),
			).toBeInTheDocument();
		});

		it('should have correct accessibility attributes for loading state', () => {
			mockUsePhysicalInstancesData.mockReturnValue({
				variables: [],
				isLoading: true,
				isError: false,
			});

			render(<Component />, { wrapper });

			const loadingContainer = screen.getByRole('status');
			expect(loadingContainer).toHaveAttribute('aria-live', 'polite');
		});
	});

	describe('Error state', () => {
		it('should render error message when there is an error', () => {
			const errorMessage = 'Failed to fetch data';
			mockUsePhysicalInstancesData.mockReturnValue({
				variables: [],
				isLoading: false,
				isError: true,
				error: new Error(errorMessage),
			});

			render(<Component />, { wrapper });

			expect(screen.getByTestId('message')).toBeInTheDocument();
			expect(screen.getByText(errorMessage)).toBeInTheDocument();
		});

		it('should have correct accessibility attributes for error state', () => {
			mockUsePhysicalInstancesData.mockReturnValue({
				variables: [],
				isLoading: false,
				isError: true,
				error: new Error('Error'),
			});

			render(<Component />, { wrapper });

			const errorContainer = screen.getByRole('alert');
			expect(errorContainer).toHaveAttribute('aria-live', 'assertive');
		});

		it('should render default error message when error is not an Error instance', () => {
			mockUsePhysicalInstancesData.mockReturnValue({
				variables: [],
				isLoading: false,
				isError: true,
				error: 'Unknown error',
			});

			render(<Component />, { wrapper });

			expect(
				screen.getByText('physicalInstance.view.errorLoading'),
			).toBeInTheDocument();
		});
	});

	describe('Successful render', () => {
		it('should render the physical instance title', () => {
			render(<Component />, { wrapper });

			expect(screen.getByText('Test Physical Instance')).toBeInTheDocument();
		});

		it('should render the data relationship name', () => {
			render(<Component />, { wrapper });

			expect(screen.getByText('Test Data Relationship')).toBeInTheDocument();
		});

		it('should have correct accessibility role for main container', () => {
			render(<Component />, { wrapper });

			expect(screen.getByRole('main')).toBeInTheDocument();
		});

		it('should have correct accessibility role for complementary section', () => {
			render(<Component />, { wrapper });

			const firstRow = screen.getAllByRole('row')[1];
			fireEvent.click(firstRow);

			expect(screen.getByRole('complementary')).toBeInTheDocument();
		});

		it('should render SearchFilters component', () => {
			render(<Component />, { wrapper });

			expect(
				screen.getByPlaceholderText('physicalInstance.view.search'),
			).toBeInTheDocument();
		});

		it('should render GlobalActionsCard component', () => {
			render(<Component />, { wrapper });

			expect(
				screen.getByText('physicalInstance.view.globalActions'),
			).toBeInTheDocument();
		});
	});

	describe('Edit modal', () => {
		it('should open edit modal when pencil button is clicked', () => {
			render(<Component />, { wrapper });

			const editButton = screen.getByLabelText(
				'physicalInstance.view.editTitle',
			);
			fireEvent.click(editButton);

			expect(
				screen.getByText('physicalInstance.view.editModal.title'),
			).toBeInTheDocument();
		});

		it('should close edit modal when cancel is clicked', async () => {
			render(<Component />, { wrapper });

			const editButton = screen.getByLabelText(
				'physicalInstance.view.editTitle',
			);
			fireEvent.click(editButton);

			const cancelButton = screen.getByText(
				'physicalInstance.view.editModal.cancel',
			);
			fireEvent.click(cancelButton);

			await waitFor(() => {
				expect(
					screen.queryByText('physicalInstance.view.editModal.title'),
				).not.toBeInTheDocument();
			});
		});

		it('should update form data in edit modal', () => {
			render(<Component />, { wrapper });

			const editButton = screen.getByLabelText(
				'physicalInstance.view.editTitle',
			);
			fireEvent.click(editButton);

			const labelInput = screen.getByLabelText(
				'physicalInstance.view.editModal.label',
			);
			fireEvent.change(labelInput, { target: { value: 'New Label' } });

			expect((labelInput as HTMLInputElement).value).toBe('New Label');
		});
	});

	describe('Filtering', () => {
		it('should filter variables by search value', async () => {
			render(<Component />, { wrapper });

			const searchInput = screen.getByPlaceholderText(
				'physicalInstance.view.search',
			);
			fireEvent.change(searchInput, { target: { value: 'Variable1' } });

			await waitFor(() => {
				expect(screen.getByText('Variable1')).toBeInTheDocument();
				expect(screen.queryByText('Variable2')).not.toBeInTheDocument();
			});
		});

		it('should filter variables by type', async () => {
			render(<Component />, { wrapper });

			const typeDropdown = screen.getByLabelText(
				'physicalInstance.view.typeFilter',
			);
			fireEvent.change(typeDropdown, { target: { value: 'code' } });

			await waitFor(() => {
				expect(screen.getByText('Variable1')).toBeInTheDocument();
				expect(screen.queryByText('Variable2')).not.toBeInTheDocument();
			});
		});

		it('should generate dynamic type options from variables', () => {
			render(<Component />, { wrapper });

			const typeDropdown = screen.getByLabelText(
				'physicalInstance.view.typeFilter',
			) as HTMLSelectElement;

			expect(typeDropdown).toBeInTheDocument();
			expect(typeDropdown).toHaveValue('all');

			// Verify all type options are present
			expect(
				screen.getByRole('option', { name: 'physicalInstance.view.allTypes' }),
			).toBeInTheDocument();
			expect(
				screen.getByRole('option', {
					name: 'physicalInstance.view.variableTypes.text',
				}),
			).toBeInTheDocument();
			expect(
				screen.getByRole('option', {
					name: 'physicalInstance.view.variableTypes.code',
				}),
			).toBeInTheDocument();
			expect(
				screen.getByRole('option', {
					name: 'physicalInstance.view.variableTypes.date',
				}),
			).toBeInTheDocument();
			expect(
				screen.getByRole('option', {
					name: 'physicalInstance.view.variableTypes.numeric',
				}),
			).toBeInTheDocument();
		});
	});

	describe('Export functionality', () => {
		beforeEach(() => {
			mockCreateObjectURL.mockReturnValue('blob:mock-url');
			mockClick.mockClear();
			mockCreateObjectURL.mockClear();
			mockRevokeObjectURL.mockClear();
		});

		it('should download DDI3 file when export button is clicked (default DDI3)', async () => {
			let capturedLink: HTMLAnchorElement | null = null;

			// Capture the link before it's removed
			const originalAppendChild = document.body.appendChild;
			document.body.appendChild = vi.fn((node) => {
				if (node instanceof HTMLAnchorElement && node.download) {
					capturedLink = node;
				}
				return originalAppendChild.call(document.body, node);
			}) as any;

			render(<Component />, { wrapper });

			// SplitButton creates multiple elements with the same aria-label, get the first button
			const exportButtons = screen.getAllByLabelText(
				'physicalInstance.view.export',
			);
			const exportButton = exportButtons.find(el => el.tagName === 'BUTTON');
			fireEvent.click(exportButton!);

			await waitFor(() => {
				expect(global.fetch).toHaveBeenCalled();
			});

			await waitFor(() => {
				expect(mockCreateObjectURL).toHaveBeenCalled();
				expect(mockClick).toHaveBeenCalled();
				expect(mockRevokeObjectURL).toHaveBeenCalled();
			});

			// Check that the link has the correct download attribute
			expect(capturedLink?.download).toBe('test_physical_instance-ddi3.xml');

			// Restore original appendChild
			document.body.appendChild = originalAppendChild;
		});

		it('should download DDI4 file when DDI4 option is selected', async () => {
			render(<Component />, { wrapper });

			// The export button is a SplitButton, get the first button
			const exportButtons = screen.getAllByLabelText(
				'physicalInstance.view.export',
			);
			const exportButton = exportButtons.find(el => el.tagName === 'BUTTON');

			// Click the button (which defaults to DDI3)
			fireEvent.click(exportButton!);

			await waitFor(() => {
				expect(mockCreateObjectURL).toHaveBeenCalled();
				expect(mockClick).toHaveBeenCalled();
			});
		});

		it('should sanitize title for filename', async () => {
			let capturedLink: HTMLAnchorElement | null = null;

			// Capture the link before it's removed
			const originalAppendChild = document.body.appendChild;
			document.body.appendChild = vi.fn((node) => {
				if (node instanceof HTMLAnchorElement && node.download) {
					capturedLink = node;
				}
				return originalAppendChild.call(document.body, node);
			}) as any;

			mockUsePhysicalInstancesData.mockReturnValue({
				data: {
					PhysicalInstance: [{ Citation: { Title: { String: { '#text': 'Test Physical Instance' } } } }],
					DataRelationship: [{ DataRelationshipName: { String: { '#text': 'Test Data Relationship' } } }],
					Variable: [],
				},
				variables: [],
				title: 'Test @ Physical # Instance!',
				dataRelationshipName: 'Test Data Relationship',
				isLoading: false,
				isError: false,
			});

			render(<Component />, { wrapper });

			const exportButtons = screen.getAllByLabelText(
				'physicalInstance.view.export',
			);
			const exportButton = exportButtons.find(el => el.tagName === 'BUTTON');
			fireEvent.click(exportButton!);

			await waitFor(() => {
				expect(mockClick).toHaveBeenCalled();
			});

			expect(capturedLink?.download).toBe(
				'test___physical___instance_-ddi3.xml',
			);

			// Restore original appendChild
			document.body.appendChild = originalAppendChild;
		});

		it('should call DDIApi.convertToDDI3 with correct data', async () => {
			const mockData = {
				PhysicalInstance: [{ Citation: { Title: { String: { '#text': 'Test Physical Instance' } } } }],
				DataRelationship: [{ DataRelationshipName: { String: { '#text': 'Test Data Relationship' } } }],
				Variable: [],
			};

			mockUsePhysicalInstancesData.mockReturnValue({
				data: mockData,
				variables: [],
				title: 'Test Physical Instance',
				dataRelationshipName: 'Test Data Relationship',
				isLoading: false,
				isError: false,
			});

			render(<Component />, { wrapper });

			const exportButtons = screen.getAllByLabelText(
				'physicalInstance.view.export',
			);
			const exportButton = exportButtons.find(el => el.tagName === 'BUTTON');
			fireEvent.click(exportButton!);

			await waitFor(() => {
				expect(global.fetch).toHaveBeenCalledWith(
					expect.stringContaining('/convert/ddi4-to-ddi3'),
					expect.objectContaining({
						method: 'POST',
						body: JSON.stringify(mockData),
					})
				);
			});
		});

		it('should handle export error gracefully', async () => {
			// Make fetch return an error response instead of rejecting
			(global.fetch as any).mockImplementationOnce(() =>
				Promise.resolve({
					ok: false,
					status: 500,
					text: () => Promise.resolve('Internal Server Error'),
				} as Response)
			);

			render(<Component />, { wrapper });

			const exportButtons = screen.getAllByLabelText(
				'physicalInstance.view.export',
			);
			const exportButton = exportButtons.find(el => el.tagName === 'BUTTON');
			fireEvent.click(exportButton!);

			await waitFor(() => {
				expect(global.fetch).toHaveBeenCalled();
			});

			// Should not create download link on error
			await waitFor(() => {
				expect(mockClick).not.toHaveBeenCalled();
			});
		});
	});

	describe('Save functionality', () => {
		it('should initialize edit modal with title and dataRelationshipName', () => {
			render(<Component />, { wrapper });

			const editButton = screen.getByLabelText(
				'physicalInstance.view.editTitle',
			);
			fireEvent.click(editButton);

			const labelInput = screen.getByLabelText(
				'physicalInstance.view.editModal.label',
			) as HTMLInputElement;
			const nameInput = screen.getByLabelText(
				'physicalInstance.view.editModal.name',
			) as HTMLInputElement;

			expect(labelInput.value).toBe('Test Physical Instance');
			expect(nameInput.value).toBe('Test Data Relationship');
		});

		it('should call mutation when save button is clicked', async () => {
			const mutateAsyncMock = vi.fn().mockResolvedValue({});
			mockUpdatePhysicalInstance.mockReturnValue({
				mutateAsync: mutateAsyncMock,
				isPending: false,
				isError: false,
			});

			render(<Component />, { wrapper });

			const editButton = screen.getByLabelText(
				'physicalInstance.view.editTitle',
			);
			fireEvent.click(editButton);

			const labelInput = screen.getByLabelText(
				'physicalInstance.view.editModal.label',
			);
			fireEvent.change(labelInput, { target: { value: 'Updated Title' } });

			// Find and submit the form
			const form = screen.getByRole('dialog').querySelector('form');
			if (form) {
				fireEvent.submit(form);
			}

			await waitFor(() => {
				expect(mutateAsyncMock).toHaveBeenCalledWith({
					id: 'test-id-123',
					data: {
						physicalInstanceLabel: 'Updated Title',
						dataRelationshipName: 'Test Data Relationship',
					},
				});
			});
		});

		it('should close modal after successful save', async () => {
			const mutateAsyncMock = vi.fn().mockResolvedValue({});
			mockUpdatePhysicalInstance.mockReturnValue({
				mutateAsync: mutateAsyncMock,
				isPending: false,
				isError: false,
			});

			render(<Component />, { wrapper });

			const editButton = screen.getByLabelText(
				'physicalInstance.view.editTitle',
			);
			fireEvent.click(editButton);

			// Find and submit the form
			const form = screen.getByRole('dialog').querySelector('form');
			if (form) {
				fireEvent.submit(form);
			}

			await waitFor(() => {
				expect(
					screen.queryByText('physicalInstance.view.editModal.title'),
				).not.toBeInTheDocument();
			});
		});

		it('should handle save error gracefully', async () => {
			const mutateAsyncMock = vi
				.fn()
				.mockRejectedValue(new Error('Save failed'));
			mockUpdatePhysicalInstance.mockReturnValue({
				mutateAsync: mutateAsyncMock,
				isPending: false,
				isError: false,
			});

			render(<Component />, { wrapper });

			const editButton = screen.getByLabelText(
				'physicalInstance.view.editTitle',
			);
			fireEvent.click(editButton);

			// Wait for modal to be visible
			await waitFor(() => {
				expect(
					screen.getByText('physicalInstance.view.editModal.title'),
				).toBeInTheDocument();
			});

			// Find and submit the form
			const form = screen.getByRole('dialog').querySelector('form');
			if (form) {
				fireEvent.submit(form);
			}

			await waitFor(() => {
				expect(mutateAsyncMock).toHaveBeenCalled();
			});

			// Modal should remain open on error
			await waitFor(() => {
				expect(
					screen.getByText('physicalInstance.view.editModal.title'),
				).toBeInTheDocument();
			});
		});
	});
});
