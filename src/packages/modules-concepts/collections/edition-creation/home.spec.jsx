import { locales } from '../../../tests-utils/default-values';
import { renderWithRouter } from '../../../tests-utils/render';
import { empty } from '../utils/general';
import Collection from './home';

vi.mock('./general', () => {
	return {
		default: () => <></>,
	};
});

describe('collection-edition-creation', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<Collection
				title=""
				general={empty()}
				members={[]}
				collectionList={[]}
				conceptList={[]}
				save={vi.fn()}
				langs={locales}
			/>,
		);
	});
});
