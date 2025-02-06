import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, Mock, vi } from 'vitest';

import { useStructures } from '@utils/hooks/structures';

import { DataStructure } from './data-structure';

// Mock useStructures hook
vi.mock('@utils/hooks/structures', () => ({
	useStructures: vi.fn(),
}));

describe('DataStructure Component', () => {
	it('should display a text input in URN mode by default if value does not match a structure', () => {
		(useStructures as Mock).mockReturnValue({ data: [] });

		render(<DataStructure value="urn:1234" onChange={vi.fn()} />);

		expect(screen.getByRole('textbox')).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /Choisir une structure/i }),
		).toBeInTheDocument();
	});

	it('should display a select dropdown in URL mode if the value matches a structure', () => {
		const structures = [
			{ iri: 'http://example.com/structure1', labelLg1: 'Structure 1' },
		];
		(useStructures as Mock).mockReturnValue({ data: structures });

		render(
			<DataStructure
				value="http://example.com/structure1"
				onChange={vi.fn()}
			/>,
		);

		expect(screen.getByText('Structure 1')).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /Saisir une URN/i }),
		).toBeInTheDocument();
	});

	it('should switch from URN mode to URL mode when clicking the button', async () => {
		(useStructures as Mock).mockReturnValue({ data: [] });
		const onChangeMock = vi.fn();

		render(<DataStructure value="urn:1234" onChange={onChangeMock} />);

		const button = screen.getByRole('button', {
			name: /Choisir une structure/i,
		});
		fireEvent.click(button);

		expect(screen.getByRole('combobox')).toBeInTheDocument();
	});

	it('should switch from URL mode to URN mode when clicking the button', async () => {
		const structures = [
			{ iri: 'http://example.com/structure1', labelLg1: 'Structure 1' },
		];
		(useStructures as Mock).mockReturnValue({ data: structures });

		render(
			<DataStructure
				value="http://example.com/structure1"
				onChange={vi.fn()}
			/>,
		);

		const button = screen.getByRole('button', { name: /Saisir une URN/i });
		fireEvent.click(button);

		expect(screen.getByRole('textbox')).toBeInTheDocument();
	});

	it('should call onChange when the user enters a value in URN mode', async () => {
		(useStructures as Mock).mockReturnValue({ data: [] });
		const onChangeMock = vi.fn();

		render(<DataStructure value="urn:1234" onChange={onChangeMock} />);

		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: 'urn:5678' } });

		expect(onChangeMock).toHaveBeenCalledWith('urn:5678');
	});

	it('should display an error message if an error is provided', async () => {
		(useStructures as Mock).mockReturnValue({ data: [] });

		render(
			<DataStructure
				value="urn:1234"
				onChange={vi.fn()}
				error="Required field"
			/>,
		);

		expect(screen.getByText('Required field')).toBeInTheDocument();
	});
});
