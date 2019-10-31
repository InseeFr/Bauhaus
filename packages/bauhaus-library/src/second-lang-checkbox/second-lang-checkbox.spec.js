import React from 'react';
import { shallow } from 'enzyme';
import CheckSecondLang from './';
import { I18NContext } from '../context';
describe('second-lang-checkbox', () => {
	it('renders without crashing', () => {
		shallow(
			<CheckSecondLang
				secondLang={true}
				onChange={() => console.log('check')}
			/>,
			{
				wrappingComponent: I18NContext.Provider,
				wrappingComponentProps: {
					value: {
						displayLg2: 'displayLg2',
					},
				},
			}
		);
	});
});
