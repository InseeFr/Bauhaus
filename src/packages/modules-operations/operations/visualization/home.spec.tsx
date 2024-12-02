import { render, screen } from '@testing-library/react';

import { Operation } from '../../../model/Operation';
import OperationsOperationVisualization from './home';

describe('OperationVisualization', () => {
	it('should renderer all informations for the main lang', () => {
		const attr = {
			prefLabelLg1: 'prefLabelLg1',
			prefLabelLg2: 'prefLabelLg2',
			altLabelLg1: 'altLabel1',
			year: '2024',
		} as unknown as Operation;
		const { container } = render(
			<OperationsOperationVisualization attr={attr} secondLang={false} />,
		);
		expect(container.querySelectorAll('.row:first-child .note')).toHaveLength(
			1,
		);
		screen.getByText('Year : 2024');
	});

	it('should renderer all informations for the second lang', () => {
		const attr = {
			prefLabelLg1: 'prefLabelLg1',
			prefLabelLg2: 'prefLabelLg2',
			altLabelLg1: 'altLabel1',
			altLabelLg2: 'altLabel2',
			year: '2024',
		} as unknown as Operation;
		const { container } = render(
			<OperationsOperationVisualization attr={attr} secondLang={true} />,
		);

		expect(container.querySelectorAll('.note')).toHaveLength(5);

		screen.getByText('Year : 2024');
	});
});
