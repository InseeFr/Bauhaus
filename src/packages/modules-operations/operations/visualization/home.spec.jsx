import { render } from '@testing-library/react';

import OperationsOperationVisualization from './home';

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
				secondLang={false}
				isModalOpen={false}
				closeModal={vi.fn()}
			/>,
		);
		expect(container.querySelectorAll('.row:first-child .note')).toHaveLength(
			1,
		);
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
				isModalOpen={false}
				closeModal={vi.fn()}
			/>,
		);

		expect(container.querySelectorAll('.note')).toHaveLength(5);
	});
});
