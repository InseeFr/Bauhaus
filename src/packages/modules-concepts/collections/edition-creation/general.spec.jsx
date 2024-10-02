import { render } from '@testing-library/react';
import CollectionGeneral from './general';
import { empty } from '../../../modules-concepts/collections/utils/general';
import { locales } from '../../../tests-utils/default-values';

vi.mock('../../../components', () => ({
	InputRmes: () => <></>,
	ClientSideError: () => <></>,
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
				handleChange={vi.fn()}
				langs={locales}
				errors={{ errorMessage: [], fields: {} }}
			/>,
		);
	});
});
