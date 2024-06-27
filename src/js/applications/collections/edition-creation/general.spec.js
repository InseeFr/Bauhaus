import { render } from '@testing-library/react';
import CollectionGeneral from './general';
import { empty } from 'js/utils/collections/general';

jest.mock('js/components/creators-input', () => ({
	__esModule: true,
	default: () => <></>,
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
