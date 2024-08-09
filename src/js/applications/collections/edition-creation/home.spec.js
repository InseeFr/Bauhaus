import Collection from './home';
import { empty } from '../../../new-architecture/modules-concepts/collections/utils/general';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';
import { locales } from '../../../new-architecture/tests-utils/default-values';

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
