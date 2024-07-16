import Collection from './home';
import { empty } from '../../../utils/collections/general';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';

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
				langs={{ lg1: 'fr', lg2: 'en' }}
			/>
		);
	});
});
