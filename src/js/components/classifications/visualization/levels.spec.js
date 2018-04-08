import React from 'react';
import { shallow } from 'enzyme';
import Levels from './levels';

const levels = [{ id: '1', label: 'Member 1' }];

describe('classification-series-levels', () => {
	it('renders without crashing', () => {
		shallow(
			<Levels
				levels={levels}
				classificationId="classification"
				secondLang={true}
			/>
		);
	});
});
