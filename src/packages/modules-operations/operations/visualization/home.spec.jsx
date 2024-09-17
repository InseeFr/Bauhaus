import { render } from '@testing-library/react';
import OperationsOperationVisualization from './home';
import { locales } from '../../../tests-utils/default-values';

describe('OperationVisualization', () => {
	it('should renderer all informations for the main lang', () => {
		const attr = {
			prefLabelLg1: 'prefLabelLg1',
			prefLabelLg2: 'prefLabelLg2',
			altLabelLg1: 'altLabel1',
		};
		const { container } = render(
			<OperationsOperationVisualization
				attr={attr}
				exportVarBook={vi.fn()}
				langs={locales}
				secondLang={false}
				isModalOpen={false}
				closeModal={vi.fn()}
			/>
		);
		expect(
			container.querySelectorAll('.row:first-child .wilco-note')
		).toHaveLength(1);
	});

	it('should renderer all informations for the second lang', () => {
		const attr = {
			prefLabelLg1: 'prefLabelLg1',
			prefLabelLg2: 'prefLabelLg2',
			altLabelLg1: 'altLabel1',
			altLabelLg2: 'altLabel2',
		};
		const { container } = render(
			<OperationsOperationVisualization
				attr={attr}
				secondLang={true}
				exportVarBook={vi.fn()}
				langs={locales}
				isModalOpen={false}
				closeModal={vi.fn()}
			/>
		);

		expect(container.querySelectorAll('.wilco-note')).toHaveLength(5);
	});
});
