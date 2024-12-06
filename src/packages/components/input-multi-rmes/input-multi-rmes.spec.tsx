import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { InputMultiRmes } from './index';

vi.mock('primereact/chips', () => ({
	Chips: ({
		value,
		onChange,
	}: {
		value: string[];
		onChange: (e: any) => void;
	}) => (
		<input
			data-testid="chips-input"
			value={value.join(',')}
			onChange={(e) => onChange({ value: e.target.value.split(',') })}
		/>
	),
}));

describe('InputMultiRmes', () => {
	const handleChangeLg1 = vi.fn();
	const handleChangeLg2 = vi.fn();

	afterEach(() => {
		handleChangeLg1.mockClear();
		handleChangeLg2.mockClear();
	});

	it('should render a single input when handleChangeLg2 is not provided', () => {
		render(
			<InputMultiRmes
				inputLg1={['value1']}
				label="testLabel"
				handleChangeLg1={handleChangeLg1}
			/>,
		);

		expect(screen.getByText('testLabel')).toBeInTheDocument();
		expect(screen.getAllByTestId('chips-input').length).toBe(1);
	});

	it('should render two inputs when handleChangeLg2 is provided', () => {
		render(
			<InputMultiRmes
				inputLg1={['value1']}
				inputLg2={['value2']}
				label="altLabelTitle"
				handleChangeLg1={handleChangeLg1}
				handleChangeLg2={handleChangeLg2}
			/>,
		);

		expect(screen.getByText('Libellé alternatif')).toBeInTheDocument();
		expect(screen.getByText('Alternative label')).toBeInTheDocument();
		expect(screen.getAllByTestId('chips-input').length).toBe(2);
	});

	it('should call handleChangeLg1 when the first input changes', () => {
		render(
			<InputMultiRmes
				inputLg1={['value1']}
				label="altLabelTitle"
				handleChangeLg1={handleChangeLg1}
			/>,
		);

		const input = screen.getByTestId('chips-input');
		fireEvent.change(input, { target: { value: 'newValue1,newValue2' } });

		expect(handleChangeLg1).toHaveBeenCalledWith(['newValue1', 'newValue2']);
	});

	it('should call handleChangeLg2 when the second input changes', () => {
		render(
			<InputMultiRmes
				inputLg1={['value1']}
				inputLg2={['value2']}
				label="altLabelTitle"
				handleChangeLg1={handleChangeLg1}
				handleChangeLg2={handleChangeLg2}
			/>,
		);

		const inputs = screen.getAllByTestId('chips-input');
		fireEvent.change(inputs[1], { target: { value: 'newValue3,newValue4' } });

		expect(handleChangeLg2).toHaveBeenCalledWith(['newValue3', 'newValue4']);
	});

	it('should fallback to the label prop if no translation is available', () => {
		render(
			<InputMultiRmes
				inputLg1={['value1']}
				label="untranslatedLabel"
				handleChangeLg1={handleChangeLg1}
			/>,
		);

		expect(screen.getByText('untranslatedLabel')).toBeInTheDocument();
	});
});
