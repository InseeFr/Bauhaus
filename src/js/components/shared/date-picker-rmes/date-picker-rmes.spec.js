import React from 'react';
import { shallow } from 'enzyme';
import DatePickerRmes from './';

describe('date-picker', () => {
	it('renders without crashing', () => {
		shallow(<DatePickerRmes />);
	});
});
