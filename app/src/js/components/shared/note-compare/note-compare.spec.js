import React from 'react';
import { shallow } from 'enzyme';
import CompareNotes from './';

const builder = n => [{ lg1: 'noteLg1', lg2: 'noteLg2', title: 'title' }];

describe('visualization-compare-notes', () => {
	it('renders without crashing', () => {
		shallow(
			<CompareNotes
				notes={{ 1: {}, 2: {} }}
				secondLang={false}
				langs={{ lg1: 'fr', lg2: 'en' }}
				version={2}
				buildNotes={builder}
			/>
		);
	});
});
