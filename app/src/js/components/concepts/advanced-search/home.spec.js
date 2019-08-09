import React from 'react';
import { shallow } from 'enzyme';
import AdvancedSearch from './home';

describe('concepts-advanced-search', () => {
	it('renders without crashing', () => {
		shallow(
			<AdvancedSearch
				conceptSearchList={[]}
				stampList={[]}
				disseminationStatusList={[]}
			/>
		);
	});
});
