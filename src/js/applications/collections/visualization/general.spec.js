import { render } from '@testing-library/react';
import CollectionGeneralVisualization from './general';
import { empty } from '../../../new-architecture/modules-concepts/collections/utils/general';
import { locales } from '../../../new-architecture/tests-utils/default-values';

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
