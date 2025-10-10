import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TextRepresentation } from './TextRepresentation';
import type { TextRepresentation as TextRepresentationType } from '../../types/api';

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => {
			const translations: Record<string, string> = {
				'physicalInstance.view.text.minLength': 'Taille minimale',
				'physicalInstance.view.text.maxLength': 'Taille maximale',
				'physicalInstance.view.text.regExp': 'Expression régulière',
			};
			return translations[key] || key;
		},
	}),
}));

vi.mock('primereact/inputtext', () => ({
	InputText: ({ id, value, onChange, type, ...props }: any) => (
		<input id={id} type={type} value={value} onChange={onChange} {...props} />
	),
}));

describe('TextRepresentation', () => {
	const mockOnChange = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render all three input fields', () => {
		render(
			<TextRepresentation representation={undefined} onChange={mockOnChange} />,
		);

		expect(screen.getByLabelText('Taille minimale')).toBeInTheDocument();
		expect(screen.getByLabelText('Taille maximale')).toBeInTheDocument();
		expect(screen.getByLabelText('Expression régulière')).toBeInTheDocument();
	});

	it('should display initial values from representation', () => {
		const representation: TextRepresentationType = {
			'@minLength': '5',
			'@maxLength': '100',
			'@regExp': '^[A-Z]+$',
		};

		render(
			<TextRepresentation
				representation={representation}
				onChange={mockOnChange}
			/>,
		);

		const minLengthInput = screen.getByLabelText(
			'Taille minimale',
		) as HTMLInputElement;
		const maxLengthInput = screen.getByLabelText(
			'Taille maximale',
		) as HTMLInputElement;
		const regExpInput = screen.getByLabelText(
			'Expression régulière',
		) as HTMLInputElement;

		expect(minLengthInput.value).toBe('5');
		expect(maxLengthInput.value).toBe('100');
		expect(regExpInput.value).toBe('^[A-Z]+$');
	});

	it('should call onChange when minLength changes', () => {
		render(
			<TextRepresentation representation={undefined} onChange={mockOnChange} />,
		);

		const minLengthInput = screen.getByLabelText('Taille minimale');
		fireEvent.change(minLengthInput, { target: { value: '10' } });

		expect(mockOnChange).toHaveBeenCalledWith({
			'@minLength': '10',
		});
	});

	it('should call onChange when maxLength changes', () => {
		render(
			<TextRepresentation representation={undefined} onChange={mockOnChange} />,
		);

		const maxLengthInput = screen.getByLabelText('Taille maximale');
		fireEvent.change(maxLengthInput, { target: { value: '50' } });

		expect(mockOnChange).toHaveBeenCalledWith({
			'@maxLength': '50',
		});
	});

	it('should call onChange when regExp changes', () => {
		render(
			<TextRepresentation representation={undefined} onChange={mockOnChange} />,
		);

		const regExpInput = screen.getByLabelText('Expression régulière');
		fireEvent.change(regExpInput, { target: { value: '^[0-9]+$' } });

		expect(mockOnChange).toHaveBeenCalledWith({
			'@regExp': '^[0-9]+$',
		});
	});

	it('should call onChange with complete representation when all fields are filled', () => {
		render(
			<TextRepresentation representation={undefined} onChange={mockOnChange} />,
		);

		const minLengthInput = screen.getByLabelText('Taille minimale');
		const maxLengthInput = screen.getByLabelText('Taille maximale');
		const regExpInput = screen.getByLabelText('Expression régulière');

		fireEvent.change(minLengthInput, { target: { value: '1' } });
		fireEvent.change(maxLengthInput, { target: { value: '255' } });
		fireEvent.change(regExpInput, { target: { value: '.*' } });

		expect(mockOnChange).toHaveBeenLastCalledWith({
			'@minLength': '1',
			'@maxLength': '255',
			'@regExp': '.*',
		});
	});

	it('should return undefined when all fields are empty', () => {
		const representation: TextRepresentationType = {
			'@minLength': '5',
			'@maxLength': '100',
			'@regExp': '^[A-Z]+$',
		};

		render(
			<TextRepresentation
				representation={representation}
				onChange={mockOnChange}
			/>,
		);

		const minLengthInput = screen.getByLabelText('Taille minimale');
		const maxLengthInput = screen.getByLabelText('Taille maximale');
		const regExpInput = screen.getByLabelText('Expression régulière');

		fireEvent.change(minLengthInput, { target: { value: '' } });
		fireEvent.change(maxLengthInput, { target: { value: '' } });
		fireEvent.change(regExpInput, { target: { value: '' } });

		expect(mockOnChange).toHaveBeenLastCalledWith(undefined);
	});

	it('should update when representation prop changes', () => {
		const { rerender } = render(
			<TextRepresentation representation={undefined} onChange={mockOnChange} />,
		);

		const newRepresentation: TextRepresentationType = {
			'@minLength': '20',
			'@maxLength': '200',
		};

		rerender(
			<TextRepresentation
				representation={newRepresentation}
				onChange={mockOnChange}
			/>,
		);

		const minLengthInput = screen.getByLabelText(
			'Taille minimale',
		) as HTMLInputElement;
		const maxLengthInput = screen.getByLabelText(
			'Taille maximale',
		) as HTMLInputElement;

		expect(minLengthInput.value).toBe('20');
		expect(maxLengthInput.value).toBe('200');
	});
});
