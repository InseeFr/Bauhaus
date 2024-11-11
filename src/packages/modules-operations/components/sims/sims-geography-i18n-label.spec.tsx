import SimsGeographyI18NLabel from './sims-geography-i18n-label';
import { render } from '@testing-library/react';
import { Geography } from './sims-geography-selector';

describe('<SimsGeographyI18NLabel />', () => {
	it('should render labels for both langs', () => {
		const geography = {
			label: 'labelLg1',
			labelLg2: 'labelLg2',
			typeTerritory: 'typeTerritory',
		} as Geography;
		const { container } = render(
			<SimsGeographyI18NLabel geography={geography} />,
		);
		expect(container.innerHTML).toBe(
			'labelLg1 <i>(labelLg2 typeTerritory)</i>',
		);
	});
});
