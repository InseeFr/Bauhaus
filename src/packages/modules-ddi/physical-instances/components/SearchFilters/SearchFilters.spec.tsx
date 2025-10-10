import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchFilters } from './SearchFilters';

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => {
			const translations: Record<string, string> = {
				'physicalInstance.view.search': 'Rechercher',
				'physicalInstance.view.typeFilter': 'Filtrer par type',
				'physicalInstance.view.newVariable': 'Nouvelle Variable',
			};
			return translations[key] || key;
		},
	}),
}));

vi.mock('primereact/inputtext', () => ({
	InputText: ({ value, onChange, placeholder, className, ...props }: any) => (
		<input
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			className={className}
			{...props}
		/>
	),
}));

vi.mock('primereact/dropdown', () => ({
	Dropdown: ({ value, options, onChange, className, ...props }: any) => (
		<select
			value={value}
			onChange={(e) => onChange({ value: e.target.value })}
			className={className}
			{...props}
		>
			{options.map((opt: any) => (
				<option key={opt.value} value={opt.value}>
					{opt.label}
				</option>
			))}
		</select>
	),
}));

vi.mock('primereact/button', () => ({
	Button: ({ label, onClick, icon, ...props }: any) => (
		<button type="button" onClick={onClick} {...props}>
			{icon && <span className={icon} />}
			{label}
		</button>
	),
}));

vi.mock('primereact/iconfield', () => ({
	IconField: ({ children, className }: any) => (
		<div className={className}>{children}</div>
	),
}));

vi.mock('primereact/inputicon', () => ({
	InputIcon: ({ className, children }: any) => (
		<span className={className}>{children}</span>
	),
}));

describe('SearchFilters', () => {
	const mockOnSearchChange = vi.fn();
	const mockOnTypeFilterChange = vi.fn();
	const mockOnNewVariable = vi.fn();

	const defaultProps = {
		searchValue: '',
		onSearchChange: mockOnSearchChange,
		typeFilter: 'all',
		onTypeFilterChange: mockOnTypeFilterChange,
		typeOptions: [
			{ label: 'Tous types', value: 'all' },
			{ label: 'Code', value: 'code' },
			{ label: 'Numeric', value: 'numeric' },
		],
		onNewVariable: mockOnNewVariable,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render search input with placeholder', () => {
		render(<SearchFilters {...defaultProps} />);

		const searchInput = screen.getByPlaceholderText('Rechercher');
		expect(searchInput).toBeInTheDocument();
	});

	it('should render type filter dropdown with options', () => {
		render(<SearchFilters {...defaultProps} />);

		const dropdown = screen.getByLabelText('Filtrer par type');
		expect(dropdown).toBeInTheDocument();
		expect(screen.getByText('Tous types')).toBeInTheDocument();
		expect(screen.getByText('Code')).toBeInTheDocument();
		expect(screen.getByText('Numeric')).toBeInTheDocument();
	});

	it('should render new variable button', () => {
		render(<SearchFilters {...defaultProps} />);

		const button = screen.getByText('Nouvelle Variable');
		expect(button).toBeInTheDocument();
	});

	it('should call onSearchChange when search input changes', () => {
		render(<SearchFilters {...defaultProps} />);

		const searchInput = screen.getByPlaceholderText('Rechercher');
		fireEvent.change(searchInput, { target: { value: 'test search' } });

		expect(mockOnSearchChange).toHaveBeenCalledWith('test search');
	});

	it('should call onTypeFilterChange when dropdown value changes', () => {
		render(<SearchFilters {...defaultProps} />);

		const dropdown = screen.getByLabelText('Filtrer par type');
		fireEvent.change(dropdown, { target: { value: 'code' } });

		expect(mockOnTypeFilterChange).toHaveBeenCalledWith('code');
	});

	it('should call onNewVariable when button is clicked', () => {
		render(<SearchFilters {...defaultProps} />);

		const button = screen.getByText('Nouvelle Variable');
		fireEvent.click(button);

		expect(mockOnNewVariable).toHaveBeenCalledTimes(1);
	});

	it('should display current search value', () => {
		render(<SearchFilters {...defaultProps} searchValue="test" />);

		const searchInput = screen.getByPlaceholderText(
			'Rechercher',
		) as HTMLInputElement;
		expect(searchInput.value).toBe('test');
	});

	it('should display current type filter value', () => {
		render(<SearchFilters {...defaultProps} typeFilter="code" />);

		const dropdown = screen.getByLabelText(
			'Filtrer par type',
		) as HTMLSelectElement;
		expect(dropdown.value).toBe('code');
	});
});
