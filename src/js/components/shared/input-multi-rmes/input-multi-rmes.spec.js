import React from 'react';
import { shallow } from 'enzyme';
import InputMultiRmes from './';

const handleChangeLg1 = () => '';
const handleChangeLg2 = () => '';
const langs = { lg1: 'fr', lg2: 'en' };
const component = (
	<InputMultiRmes
		inputLg1="altLg1 || altLg1Bis"
		inputLg2="altLg2"
		label="Input Label"
		handleChangeLg1={handleChangeLg1}
		handleChangeLg2={handleChangeLg2}
		langs={langs}
	/>
);

describe('inputMulti', () => {
	it('renders without crashing', () => {
		shallow(component);
	});

	it('returns arrayLg1 from component state', () => {
		const wrapper = shallow(component);
		expect(wrapper.state('arrayLg1')).toEqual(['altLg1', 'altLg1Bis']);
	});

	it('should add an empty string when clicking on the Lg1/plus button', () => {
		const wrapper = shallow(component);
		wrapper
			.find('.glyphicon-plus')
			.first()
			.simulate('click');
		expect(wrapper.state('arrayLg1')).toEqual(['altLg1', 'altLg1Bis', '']);
	});

	fit('should display the modal when clicking on the Lg1/minus button', () => {
		const wrapper = shallow(component);
		wrapper
			.find('.glyphicon-minus')
			.first()
			.simulate('click');
		expect(wrapper.state('modalDelete')).toBeTruthy();
	});
});
