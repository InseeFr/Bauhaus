import { render, fireEvent } from '@testing-library/react';

import { InputMultiRmes } from './';

const handleChangeLg1 = () => '';
const handleChangeLg2 = () => '';
const component = (
	<InputMultiRmes
		inputLg1={['altLg1', 'altLg1Bis']}
		inputLg2={['altLg2']}
		label="Input Label"
		handleChangeLg1={handleChangeLg1}
		handleChangeLg2={handleChangeLg2}
	/>
);

describe('inputMulti', () => {
	it('renders without crashing', () => {
		render(component);
	});

	it('returns arrayLg1 from component state', () => {
		const { container } = render(component);

		const inputs = container.querySelectorAll<HTMLInputElement>(
			'.form-group:first-child input',
		)!;

		expect(inputs[0].value).toBe('altLg1');
		expect(inputs[1].value).toBe('altLg1Bis');
	});

	it('should add an empty string when clicking on the Lg1/plus button', () => {
		const { container } = render(component);

		fireEvent.click(container.querySelector('.glyphicon-plus')!);
		const inputs = container.querySelectorAll<HTMLInputElement>(
			'.form-group:first-child input',
		)!;

		expect(inputs[0].value).toBe('altLg1');
		expect(inputs[1].value).toBe('altLg1Bis');
		expect(inputs[2].value).toBe('');
	});
});
