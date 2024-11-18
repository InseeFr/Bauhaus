import { render } from '@testing-library/react';
import CollectionGeneral from './general';
import { empty } from '../../../modules-concepts/collections/utils/general';
import { locales } from '../../../tests-utils/default-values';

vi.mock('@components/form/input', () => ({ TextInput: () => <></> }));
vi.mock('@components/errors-bloc', () => ({ ClientSideError: () => <></> }));
vi.mock('@components/input-rmes', () => ({ InputRmes: () => <></> }));
vi.mock('@components/creators-input', () => ({ CreatorsInput: () => <></> }));
vi.mock('@components/required-icon', () => ({ RequiredIcon: () => <></> }));

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
