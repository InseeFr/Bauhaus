import React from 'react';
import { shallow } from 'enzyme';
import IndicatorInformation from './general';
import DisplayLinks from 'js/components/operations/shared/links/';
import SeeAlso from 'js/components/operations/shared/seeAlso';

const langs = {
	lg1: 'fr',
	lg2: 'en',
};
describe('IndicatorInformation', () => {
	it('should renderer all informations for the main lang', () => {
		const attr = {
			prefLabelLg1: 'prefLabelLg1',
			themeLg1: 'themeLg1',
			abstractLg1: 'descriptionLg1',
		};
		const general = shallow(<IndicatorInformation attr={attr} langs={langs} />);
		expect(general.find(DisplayLinks).length).toBe(3);
		expect(general.find(SeeAlso).length).toBe(1);
	});
});
