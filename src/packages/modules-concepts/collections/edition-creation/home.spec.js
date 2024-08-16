import Collection from './home';
import { empty } from '../utils/general';
import { renderWithRouter } from '../../../tests-utils/render';
import { locales } from '../../../tests-utils/default-values';

jest.mock('./general', () => () => <></>);

describe('collection-edition-creation', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<Collection
				title=""
				general={empty()}
				members={[]}
				collectionList={[]}
				conceptList={[]}
				save={jest.fn()}
				langs={locales}
			/>
		);
	});
});
