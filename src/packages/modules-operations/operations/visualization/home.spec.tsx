<<<<<<< HEAD:src/packages/modules-operations/operations/visualization/home.spec.jsx
import { render } from '@testing-library/react';

=======
import { render, screen } from '@testing-library/react';
>>>>>>> d60f6cf8 (feat: add unit test):src/packages/modules-operations/operations/visualization/home.spec.tsx
import OperationsOperationVisualization from './home';
import { Operation } from '../../../model/Operation';

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
