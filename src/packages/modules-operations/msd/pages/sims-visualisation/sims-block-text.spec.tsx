import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Rubric } from '../../../../model/Sims';
import SimsBlockText from './sims-block-text';

describe('SimsBlockText', () => {
	it('should display the labelLg1 when isSecondLang is false', () => {
		const mockRubric = {
			labelLg1: 'Primary Language Label',
			labelLg2: 'Second Language Label',
		} as Rubric;

		const { container } = render(
			<SimsBlockText currentSection={mockRubric} isSecondLang={false} />,
		);

		expect(container.textContent).toBe('Primary Language Label');
	});

	it('should display the labelLg2 when isSecondLang is true', () => {
		const mockRubric = {
			labelLg1: 'Primary Language Label',
			labelLg2: 'Second Language Label',
		} as Rubric;

		const { container } = render(
			<SimsBlockText currentSection={mockRubric} isSecondLang={true} />,
		);

		expect(container.textContent).toBe('Second Language Label');
	});

	it('should display an empty string if the selected label is not present', () => {
		const mockRubric = {
			labelLg1: '',
			labelLg2: '',
		} as Rubric;

		const { container } = render(
			<SimsBlockText currentSection={mockRubric} isSecondLang={false} />,
		);

		expect(container.textContent).toBe('');
	});

	it('should not break if the currentSection is an empty object', () => {
		const mockRubric = {} as Rubric;

		const { container } = render(
			<SimsBlockText currentSection={mockRubric} isSecondLang={false} />,
		);

		expect(container.textContent).toBe('');
	});
});
