import { render } from '@testing-library/react';
import CollectionGeneral from './general';
import { empty } from '../../../new-architecture/modules-concepts/collections/utils/general';
import { locales } from '../../../new-architecture/tests-utils/default-values';

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
				langs={locales}
			/>
		);
	});
});
