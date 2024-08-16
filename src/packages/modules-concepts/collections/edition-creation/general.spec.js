import { render } from '@testing-library/react';
import CollectionGeneral from './general';
import { empty } from '../../../modules-concepts/collections/utils/general';
import { locales } from '../../../tests-utils/default-values';

jest.mock('../../../components', () => ({
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
