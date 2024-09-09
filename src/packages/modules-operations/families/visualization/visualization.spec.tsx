import { render } from '@testing-library/react';
import OperationsFamilyVisualization from './visualization';
import { locales } from '../../../tests-utils/default-values';

describe('FamilyInformation', () => {
	it('should renderer all informations for the main lang', () => {
		const attr = {
			prefLabelLg1: 'prefLabelLg1',
			themeLg1: 'themeLg1',
			abstractLg1: 'descriptionLg1',
		};
		const { container } = render(
			<OperationsFamilyVisualization
				attr={attr}
				langs={locales}
				secondLang={false}
			/>
		);
		expect(container.querySelectorAll('.wilco-note')).toHaveLength(4);
	});

	it('should renderer all informations for the second lang', () => {
		const attr = {
			prefLabelLg1: 'prefLabelLg1',
			themeLg1: 'themeLg1',
			abstractLg1: 'descriptionLg1',
			prefLabelLg2: 'prefLabelLg2',
			themeLg2: 'themeLg2',
			abstractLg2: 'descriptionLg2',
		};
		const { container } = render(
			<OperationsFamilyVisualization
				attr={attr}
				secondLang={true}
				langs={locales}
			/>
		);
		expect(container.querySelectorAll('.wilco-note')).toHaveLength(7);
	});
});
