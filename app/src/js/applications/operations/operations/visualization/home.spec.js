import { render } from '@testing-library/react';
import OperationsOperationVisualization from './home';

const langs = {
	lg1: 'fr',
	lg2: 'en',
};
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
				exportVarBook={jest.fn()}
				langs={langs}
				secondLang={false}
				isModalOpen={false}
				closeModal={jest.fn()}
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
				exportVarBook={jest.fn()}
				langs={langs}
				isModalOpen={false}
				closeModal={jest.fn()}
			/>
		);

		expect(container.querySelectorAll('.wilco-note')).toHaveLength(5);
	});
});
