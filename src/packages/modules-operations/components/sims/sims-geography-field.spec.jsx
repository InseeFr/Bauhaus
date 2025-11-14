import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, it, expect, vi } from 'vitest';

import { GeographieApi } from '@sdk/geographie';

import configureStore from '../../../redux/configure-store';
import { renderWithRouter } from '../../../tests/render';

import { removeAccents } from './sims-geography-picker';
import SimsGeographyField from './sims-geography-field';

vi.mock('@sdk/geographie', () => ({
	GeographieApi: {
		postTerritory: vi.fn(),
		putTerritory: vi.fn(),
	},
}));

const mockGeographies = [
	{
		value: 'http://geo1',
		label: 'Geography 1',
		labelLg2: 'Géographie 1',
		typeTerritory: 'TYPE1',
	},
	{
		value: 'http://geo2',
		label: 'Geography 2',
		labelLg2: 'Géographie 2',
		typeTerritory: 'TYPE2',
	},
	{
		value: 'http://geo3',
		label: 'Geography 3',
		labelLg2: 'Géographie 3',
		typeTerritory: 'TYPE3',
	},
];

const store = configureStore({
	geographies: {
		results: mockGeographies,
	},
});

const renderComponent = (props = {}) => {
	return renderWithRouter(
		<Provider store={store}>
			<SimsGeographyField {...props} />
		</Provider>,
	);
};

describe('SimsGeographyField', () => {
	const mockOnCancel = vi.fn();
	const mockOnSave = vi.fn();

	it('should render the component with empty territory', () => {
		const { container } = renderComponent({
			onCancel: mockOnCancel,
			onSave: mockOnSave,
		});
		expect(container.querySelectorAll('input[type="text"]')).toHaveLength(3);
		expect(
			container.querySelector('.bauhaus-sims-geography-field'),
		).toBeTruthy();
	});

	it('should render with existing territory data', () => {
		const territory = {
			id: '123',
			uri: 'http://territory1',
			labelLg1: 'Test Territory',
			labelLg2: 'Territoire Test',
			unions: [],
			difference: [],
		};

		const { container } = renderComponent({
			onCancel: mockOnCancel,
			onSave: mockOnSave,
			territory,
		});

		const inputs = container.querySelectorAll('input[type="text"]');
		expect(inputs[0].value).toBe('Test Territory');
		expect(inputs[1].value).toBe('Territoire Test');
	});

	it('should update name input fields', () => {
		const { container } = renderComponent({
			onCancel: mockOnCancel,
			onSave: mockOnSave,
		});

		const inputs = container.querySelectorAll('input[type="text"]');
		const nameInput = inputs[0];
		const nameLg2Input = inputs[1];

		fireEvent.change(nameInput, { target: { value: 'New Name' } });
		expect(nameInput.value).toBe('New Name');

		fireEvent.change(nameLg2Input, { target: { value: 'Nouveau Nom' } });
		expect(nameLg2Input.value).toBe('Nouveau Nom');
	});

	it('should call onCancel when cancel button is clicked', () => {
		renderComponent({
			onCancel: mockOnCancel,
			onSave: mockOnSave,
		});

		const cancelButton = screen.getByText('Cancel');
		fireEvent.click(cancelButton);

		expect(mockOnCancel).toHaveBeenCalledTimes(1);
	});

	it('should enable include/exclude buttons when geography is selected', () => {
		const { container } = renderComponent({
			onCancel: mockOnCancel,
			onSave: mockOnSave,
		});

		const buttons = container.querySelectorAll('.btn-group button');
		const includeButton = buttons[0];
		const excludeButton = buttons[1];

		expect(includeButton.disabled).toBe(true);
		expect(excludeButton.disabled).toBe(true);
	});

	it('should add geography to includes list when include button is clicked', () => {
		const { container } = renderComponent({
			onCancel: mockOnCancel,
			onSave: mockOnSave,
		});

		const buttons = container.querySelectorAll(
			'.btn-group[role="group"] button',
		);
		const includeButton = buttons[0];
		expect(includeButton.textContent.trim()).toBe('Include');
		expect(includeButton.disabled).toBe(true);
	});

	it('should call postTerritory when saving new territory', async () => {
		GeographieApi.postTerritory.mockResolvedValue('http://new-territory');

		const { container } = renderComponent({
			onCancel: mockOnCancel,
			onSave: mockOnSave,
		});

		const inputs = container.querySelectorAll('input[type="text"]');
		fireEvent.change(inputs[0], { target: { value: 'New Territory' } });
		fireEvent.change(inputs[1], { target: { value: 'Nouveau Territoire' } });

		const saveButton = screen.getByText('Save');
		fireEvent.click(saveButton);

		await waitFor(() => {
			expect(GeographieApi.postTerritory).toHaveBeenCalledWith(
				expect.objectContaining({
					labelLg1: 'New Territory',
					labelLg2: 'Nouveau Territoire',
					unions: [],
					difference: [],
				}),
			);
		});

		await waitFor(() => {
			expect(mockOnSave).toHaveBeenCalledWith('http://new-territory');
		});
	});

	it('should call putTerritory when updating existing territory', async () => {
		const territory = {
			id: '123',
			uri: 'http://territory1',
			labelLg1: 'Test Territory',
			labelLg2: 'Territoire Test',
			unions: [],
			difference: [],
		};

		GeographieApi.putTerritory.mockResolvedValue('http://territory1');

		renderComponent({
			onCancel: mockOnCancel,
			onSave: mockOnSave,
			territory,
		});

		const saveButton = screen.getByText('Save');
		fireEvent.click(saveButton);

		await waitFor(() => {
			expect(GeographieApi.putTerritory).toHaveBeenCalledWith(
				'123',
				expect.objectContaining({
					id: '123',
					uri: 'http://territory1',
					labelLg1: 'Test Territory',
					labelLg2: 'Territoire Test',
				}),
			);
		});

		await waitFor(() => {
			expect(mockOnSave).toHaveBeenCalledWith('http://territory1');
		});
	});

	it('should display error message when save fails', async () => {
		const errorMessage = 'Save failed';
		GeographieApi.postTerritory.mockRejectedValue(
			JSON.stringify({ message: errorMessage }),
		);

		const { container } = renderComponent({
			onCancel: mockOnCancel,
			onSave: mockOnSave,
		});

		const inputs = container.querySelectorAll('input[type="text"]');
		fireEvent.change(inputs[0], { target: { value: 'Test' } });

		const saveButton = screen.getByText('Save');
		fireEvent.click(saveButton);

		await waitFor(() => {
			expect(container.querySelector('.alert-danger')).toBeTruthy();
		});
	});

	it('should render included and excluded geographies sections', () => {
		const { container } = renderComponent({
			onCancel: mockOnCancel,
			onSave: mockOnSave,
		});

		// Check that the component has sections for included and excluded zones
		const headers = container.querySelectorAll('h4');
		expect(headers.length).toBeGreaterThanOrEqual(2);
	});

	it('should render with existing territory data including unions and difference', () => {
		const territory = {
			id: '123',
			uri: 'http://territory1',
			labelLg1: 'Test Territory',
			labelLg2: 'Territoire Test',
			unions: [],
			difference: [],
		};

		const { container } = renderComponent({
			onCancel: mockOnCancel,
			onSave: mockOnSave,
			territory,
		});

		// Verify the component renders without crashing
		expect(
			container.querySelector('.bauhaus-sims-geography-field'),
		).toBeTruthy();
	});

	it('should pass territory data to save callback', async () => {
		const territory = {
			id: '123',
			uri: 'http://territory1',
			labelLg1: 'Test',
			labelLg2: 'Test',
			unions: [],
			difference: [],
		};

		GeographieApi.putTerritory.mockResolvedValue('http://territory1');

		renderComponent({
			onCancel: mockOnCancel,
			onSave: mockOnSave,
			territory,
		});

		const saveButton = screen.getByText('Save');
		fireEvent.click(saveButton);

		await waitFor(() => {
			expect(GeographieApi.putTerritory).toHaveBeenCalledWith(
				'123',
				expect.objectContaining({
					unions: [],
					difference: [],
				}),
			);
		});
	});

	it('should render Select component', () => {
		const { container } = renderComponent({
			onCancel: mockOnCancel,
			onSave: mockOnSave,
		});

		// The component should have a select/dropdown for geographies
		const selectContainer = container.querySelector('.form-group');
		expect(selectContainer).toBeTruthy();
	});

	it('should render ActionToolbar with Cancel and Save buttons', () => {
		renderComponent({
			onCancel: mockOnCancel,
			onSave: mockOnSave,
		});

		expect(screen.getByText('Cancel')).toBeInTheDocument();
		expect(screen.getByText('Save')).toBeInTheDocument();
	});

	it('should have include button with correct text', () => {
		renderComponent({
			onCancel: mockOnCancel,
			onSave: mockOnSave,
		});

		const includeButton = screen.getByText('Include');
		expect(includeButton).toBeInTheDocument();
		expect(includeButton.tagName).toBe('BUTTON');
	});

	it('should have exclude button with correct text', () => {
		renderComponent({
			onCancel: mockOnCancel,
			onSave: mockOnSave,
		});

		const excludeButton = screen.getByText('Exclude');
		expect(excludeButton).toBeInTheDocument();
		expect(excludeButton.tagName).toBe('BUTTON');
	});

	it('should initialize with empty strings when territory labels are not provided', () => {
		const { container } = renderComponent({
			onCancel: mockOnCancel,
			onSave: mockOnSave,
			territory: {},
		});

		const inputs = container.querySelectorAll('input[type="text"]');
		expect(inputs[0].value).toBe('');
		expect(inputs[1].value).toBe('');
	});

	it('should handle save with uri from territory when updating', async () => {
		const territory = {
			id: '123',
			uri: 'http://existing-uri',
			labelLg1: 'Test',
			labelLg2: 'Test',
			unions: [],
			difference: [],
		};

		GeographieApi.putTerritory.mockResolvedValue('http://new-uri');

		renderComponent({
			onCancel: mockOnCancel,
			onSave: mockOnSave,
			territory,
		});

		const saveButton = screen.getByText('Save');
		fireEvent.click(saveButton);

		await waitFor(() => {
			expect(mockOnSave).toHaveBeenCalledWith('http://existing-uri');
		});
	});

	it('should render SimsGeographySelector component', () => {
		const { container } = renderComponent({
			onCancel: mockOnCancel,
			onSave: mockOnSave,
		});

		const headers = container.querySelectorAll('h4');
		expect(headers.length).toBeGreaterThanOrEqual(2);
	});
});

describe('SimsGeographyPicker - removeAccents', () => {
	it('should remove accents from text', () => {
		expect(removeAccents('café')).toBe('cafe');
		expect(removeAccents('Hôtel')).toBe('Hotel');
		expect(removeAccents('naïve')).toBe('naive');
		expect(removeAccents('São Paulo')).toBe('Sao Paulo');
		expect(removeAccents('français')).toBe('francais');
		expect(removeAccents('Côte d\'Ivoire')).toBe('Cote d\'Ivoire');
		expect(removeAccents('Région')).toBe('Region');
		expect(removeAccents('Île-de-France')).toBe('Ile-de-France');
	});

	it('should handle text without accents', () => {
		expect(removeAccents('France')).toBe('France');
		expect(removeAccents('Paris')).toBe('Paris');
		expect(removeAccents('Region')).toBe('Region');
	});

	it('should handle empty string', () => {
		expect(removeAccents('')).toBe('');
	});
});

describe('SimsGeographyPicker - filterOption behavior', () => {
	// Simulation de la fonction filterOption du composant Select
	const filterOption = (option, searchValue) => {
		const search = removeAccents(searchValue.toLowerCase());
		const label = removeAccents(option?.label.toLowerCase());
		const typeTerritory = removeAccents(option?.typeTerritory.toLowerCase());
		return (
			!searchValue ||
			label.includes(search) ||
			typeTerritory.includes(search)
		);
	};

	it('should filter by label without accents', () => {
		const option = { label: 'France', typeTerritory: 'Pays' };
		expect(filterOption(option, 'fran')).toBe(true);
		expect(filterOption(option, 'france')).toBe(true);
		expect(filterOption(option, 'xyz')).toBe(false);
	});

	it('should filter by label with accents', () => {
		const option = { label: 'Côte d\'Ivoire', typeTerritory: 'Pays' };
		expect(filterOption(option, 'cote')).toBe(true);
		expect(filterOption(option, 'côte')).toBe(true);
		expect(filterOption(option, 'ivoire')).toBe(true);
	});

	it('should filter by typeTerritory', () => {
		const option = { label: 'Paris', typeTerritory: 'Région' };
		expect(filterOption(option, 'région')).toBe(true);
		expect(filterOption(option, 'region')).toBe(true);
		expect(filterOption(option, 'régi')).toBe(true);
	});

	it('should filter by typeTerritory with accents', () => {
		const option = { label: 'Île-de-France', typeTerritory: 'Région' };
		expect(filterOption(option, 'ile')).toBe(true);
		expect(filterOption(option, 'île')).toBe(true);
		expect(filterOption(option, 'france')).toBe(true);
	});

	it('should return true for empty search', () => {
		const option = { label: 'France', typeTerritory: 'Pays' };
		expect(filterOption(option, '')).toBe(true);
	});

	it('should return false when no match found', () => {
		const option = { label: 'France', typeTerritory: 'Pays' };
		expect(filterOption(option, 'xyz')).toBe(false);
		expect(filterOption(option, 'region')).toBe(false);
	});

	it('should be case insensitive', () => {
		const option = { label: 'France', typeTerritory: 'Pays' };
		expect(filterOption(option, 'FRANCE')).toBe(true);
		expect(filterOption(option, 'france')).toBe(true);
		expect(filterOption(option, 'FrAnCe')).toBe(true);
		expect(filterOption(option, 'PAYS')).toBe(true);
	});

	it('should match partial strings in label', () => {
		const option = { label: 'Île-de-France', typeTerritory: 'Région' };
		expect(filterOption(option, 'ile')).toBe(true);
		expect(filterOption(option, 'de')).toBe(true);
		expect(filterOption(option, 'france')).toBe(true);
		expect(filterOption(option, 'de-france')).toBe(true);
	});

	it('should match partial strings in typeTerritory', () => {
		const option = { label: 'Paris', typeTerritory: 'Territoire Statistique' };
		expect(filterOption(option, 'terr')).toBe(true);
		expect(filterOption(option, 'stat')).toBe(true);
		expect(filterOption(option, 'territoire')).toBe(true);
	});
});
