import React from 'react';
import { shallow } from 'enzyme';
import SerieInformation from './general';
import { Note } from 'js/components/shared/note';

const langs = {
	lg1: 'fr',
	lg2: 'en',
};
describe('SerieInformation', () => {
	it('should renderer all informations for the main lang', () => {
		const attr = {
			intitule1: 'intitule1',
			altLabel1: 'altLabel1',
			summary1: 'summary1',
			history1: 'history1',
		};
		const general = shallow(<SerieInformation attr={attr} langs={langs} />);
		expect(general.find(Note).length).toBe(4);
	});

	it('should renderer all informations for the second lang', () => {
		const attr = {
			intitule1: 'intitule1',
			altLabel1: 'altLabel1',
			summary1: 'summary1',
			history1: 'history1',
			intitule2: 'intitule2',
			altLabel2: 'altLabel2',
			summary2: 'summary2',
			history2: 'history2',
		};
		const general = shallow(
			<SerieInformation attr={attr} secondLang={true} langs={langs} />
		);
		expect(general.find(Note).length).toBe(8);
	});
});
