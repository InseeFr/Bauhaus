import React from 'react';
import { shallow } from 'enzyme';
import Narrowers from './narrowers';

const narrowers = [{ id: '1', label: 'Narrower 1' }];

describe('classification-item-narrowers', () => {
	it('renders without crashing', () => {
		shallow(
			<Narrowers
				narrowers={narrowers}
				classificationId="id"
				secondLang={true}
			/>
		);
	});
});
