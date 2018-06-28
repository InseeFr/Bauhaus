import React from 'react';
import { shallow } from 'enzyme';
import FamilyInformation from './general';
import { Note } from 'js/components/shared/note';

const langs = {
	lg1: 'fr',
	lg2: 'en',
};
describe('FamilyInformation', () => {
	it('should renderer all informations for the main lang', () => {
		const attr = {
			intitule1: 'intitule1',
			theme1: 'theme1',
			descriptionLg1: 'descriptionLg1',
		};
		const general = shallow(<FamilyInformation attr={attr} langs={langs} />);
		expect(general.find(Note).length).toBe(3);
	});

	it('should renderer all informations for the second lang', () => {
		const attr = {
			intitule1: 'intitule1',
			theme1: 'theme1',
			descriptionLg1: 'descriptionLg1',
			intitule2: 'intitule2',
			theme2: 'theme2',
			descriptionLg2: 'descriptionLg2',
		};
		const general = shallow(
			<FamilyInformation attr={attr} secondLang={true} langs={langs} />
		);
		expect(general.find(Note).length).toBe(6);
	});
});
