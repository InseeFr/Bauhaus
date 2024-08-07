import { render } from '@testing-library/react';
import CollectionGeneral from './general';
import { empty } from '../../../utils/collections/general';

jest.mock('../../../new-architecture/components', () => ({
	TextInput: () => <></>,
	Row: () => <></>,
	CreatorsInput: () => <></>,
	RequiredIcon: () => <></>,
}));
describe('collection-edition-creation-general', () => {
	it('renders without crashing', () => {
		render(
			<CollectionGeneral
				general={empty()}
				handleChange={jest.fn()}
				langs={{ lg1: 'fr', lg2: 'en' }}
			/>
		);
	});
});
