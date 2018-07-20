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
			prefLabelLg1: 'prefLabelLg1',
			themeLg1: 'themeLg1',
			abstractLg1: 'descriptionLg1',
		};
		const general = shallow(<FamilyInformation attr={attr} langs={langs} />);
		expect(general.find(Note).length).toBe(2);
	});

	it('should renderer all informations for the second lang', () => {
		const attr = {
			prefLabelLg1: 'prefLabelLg1',
			themeLg1: 'themeLg1',
			abstractLg1: 'descriptionLg1',
			prefLabelLg2: 'prefLabelLg2',
			themeLg2: 'themeLg2',
			abstractLg2: 'descriptionLg2',
		};
		const general = shallow(
			<FamilyInformation attr={attr} secondLang={true} langs={langs} />
		);
		expect(general.find(Note).length).toBe(4);
	});
});
