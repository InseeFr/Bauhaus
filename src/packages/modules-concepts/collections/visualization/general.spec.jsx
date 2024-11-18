import { render } from '@testing-library/react';

import { locales } from '../../../tests-utils/default-values';
import { empty } from '../utils/general';
import CollectionGeneralVisualization from './general';

describe('collection-visualization-general', () => {
	it('renders without crashing', () => {
		render(
			<CollectionGeneralVisualization
				attr={empty()}
				secondLang={false}
				langs={locales}
			/>,
		);
	});
});
