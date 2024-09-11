import { render } from '@testing-library/react';
import CollectionGeneralVisualization from './general';
import { empty } from '../utils/general';
import { locales } from '../../../tests-utils/default-values';

describe('collection-visualization-general', () => {
	it('renders without crashing', () => {
		render(
			<CollectionGeneralVisualization
				attr={empty()}
				secondLang={false}
				langs={locales}
			/>
		);
	});
});
