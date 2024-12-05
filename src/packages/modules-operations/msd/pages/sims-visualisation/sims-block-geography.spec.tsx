import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Rubric } from '../../../../model/Sims';
import SimsBlockGeography from './sims-block-geography';

describe('SimsBlockGeography', () => {
	it('should display the labelLg1 when isSecondLang is false', () => {
		const mockRubric = {
			labelLg1: 'Primary Geography Label',
			labelLg2: 'Second Geography Label',
		} as Rubric;

		const { container } = render(
			<SimsBlockGeography currentSection={mockRubric} isSecondLang={false} />,
		);

		expect(container.textContent).toBe('Primary Geography Label');
	});

	it('should display the labelLg2 when isSecondLang is true', () => {
		const mockRubric = {
			labelLg1: 'Primary Geography Label',
			labelLg2: 'Second Geography Label',
		} as Rubric;

		const { container } = render(
			<SimsBlockGeography currentSection={mockRubric} isSecondLang={true} />,
		);

		expect(container.textContent).toBe('Second Geography Label');
	});

	it('should render nothing if currentSection has no labels', () => {
		const mockRubric = {
			labelLg1: '',
			labelLg2: '',
		} as Rubric;

		const { container } = render(
			<SimsBlockGeography currentSection={mockRubric} isSecondLang={false} />,
		);

		expect(container.textContent).toBe('');
	});
});
