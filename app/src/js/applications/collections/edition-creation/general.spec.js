import React from 'react';
import { render } from '@testing-library/react';
import CollectionGeneral from './general';
import { empty } from 'js/utils/collections/general';

jest.mock('bauhaus-operations', () => ({
	CreatorsInput: () => <></>
}))
describe('collection-edition-creation-general', () => {
	it('renders without crashing', () => {
		render(
			<CollectionGeneral
				general={empty()}
				handleChange={() => console.log('save')}
				langs={{ lg1: 'fr', lg2: 'en' }}
			/>
		);
	});
});
