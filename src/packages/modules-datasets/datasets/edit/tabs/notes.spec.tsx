import { Dataset } from '@model/Dataset';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import { Notes } from './notes';

// Mock du composant MDEditor
vi.mock('@components/rich-editor/react-md-editor', () => ({
	MDEditor: ({
		text,
		handleChange,
	}: Readonly<{ text: string; handleChange: (value: string) => void }>) => (
		<textarea
			data-testid="md-editor"
			value={text}
			onChange={(e) => handleChange(e.target.value)}
		/>
	),
}));

describe('Notes component', () => {
	it('should render all textareas with initial values', () => {
		const editingDataset = {
			abstractLg1: 'Abstract 1',
			abstractLg2: 'Abstract 2',
			descriptionLg1: 'Description 1',
			descriptionLg2: 'Description 2',
			cautionLg1: 'Caution 1',
			cautionLg2: 'Caution 2',
		} as Dataset;

		render(
			<Notes editingDataset={editingDataset} setEditingDataset={vi.fn()} />,
		);

		const editors = screen.getAllByTestId('md-editor');
		expect(editors).toHaveLength(6);
		expect(editors[0]).toHaveValue('Abstract 1');
		expect(editors[1]).toHaveValue('Abstract 2');
		expect(editors[2]).toHaveValue('Description 1');
		expect(editors[3]).toHaveValue('Description 2');
		expect(editors[4]).toHaveValue('Caution 1');
		expect(editors[5]).toHaveValue('Caution 2');
	});

	it('should update dataset when text is changed', () => {
		const editingDataset = {
			abstractLg1: 'Abstract 1',
			abstractLg2: 'Abstract 2',
			descriptionLg1: 'Description 1',
			descriptionLg2: 'Description 2',
			cautionLg1: 'Caution 1',
			cautionLg2: 'Caution 2',
		} as Dataset;

		const setEditingDataset = vi.fn();
		render(
			<Notes
				editingDataset={editingDataset}
				setEditingDataset={setEditingDataset}
			/>,
		);

		const editors = screen.getAllByTestId('md-editor');
		fireEvent.change(editors[0], { target: { value: 'New Abstract 1' } });

		expect(setEditingDataset).toHaveBeenCalledWith({
			...editingDataset,
			abstractLg1: 'New Abstract 1',
		});
	});
});
