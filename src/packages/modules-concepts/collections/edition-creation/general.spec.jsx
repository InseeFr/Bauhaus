import { render } from '@testing-library/react';

import { locales } from '../../../tests/default-values';
import { empty } from '../utils/general';
import CollectionGeneral from './general';

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
