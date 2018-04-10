import React from 'react';
import { shallow } from 'enzyme';
import ExportCollection from './home';

describe('collection-export', () => {
	it('renders without crashing', () => {
		shallow(
			<ExportCollection
				collections={[]}
				handleExportCollectionList={(a, b) => console.log('export')}
			/>
		);
	});
});
