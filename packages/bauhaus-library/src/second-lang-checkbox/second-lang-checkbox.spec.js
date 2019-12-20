import React from 'react';
import { shallow } from 'enzyme';
import CheckSecondLang from './';

describe('second-lang-checkbox', () => {
	it('renders without crashing', () => {
		shallow(
			<CheckSecondLang
				secondLang={true}
				onChange={() => console.log('check')}
			/>
		);
	});
});
