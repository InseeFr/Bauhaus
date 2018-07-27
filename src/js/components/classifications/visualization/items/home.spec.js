import React from 'react';
import { shallow } from 'enzyme';
import ClassificationItems from './home';

describe('classification-items-home', () => {
	it('renders without crashing', () => {
		shallow(
			<ClassificationItems
				items={[]}
				classificationId="id"
				secondLang={false}
				saveSecondLang={() => console.log('save second lang')}
			/>
		);
	});
});
