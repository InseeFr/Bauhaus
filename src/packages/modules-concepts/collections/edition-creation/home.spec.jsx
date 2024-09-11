import Collection from './home';
import { empty } from '../utils/general';
import { renderWithRouter } from '../../../tests-utils/render';
import { locales } from '../../../tests-utils/default-values';

vi.mock('./general', ()  => {
	return {
		default: () => <></>
}});

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
			/>
		);
	});
});
