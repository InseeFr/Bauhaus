import { render } from '@testing-library/react';
import CollectionGeneralVisualization from './general';
import { locales } from '../../../tests-utils/default-values';
import { empty } from '../utils/general';

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
