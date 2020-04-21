import React from 'react';
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
				exportVarBook={() => {}}
				langs={langs}
				secondLang={false}
				isModalOpen={false}
				closeModal={() => {}}
			/>
		);
		expect(
			container.querySelectorAll('.row:first-child .wilco-note').length
		).toBe(1);
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
				exportVarBook={() => {}}
				langs={langs}
				isModalOpen={false}
				closeModal={() => {}}
			/>
		);

		expect(container.querySelectorAll('.wilco-note')).toHaveLength(5);
	});
});
