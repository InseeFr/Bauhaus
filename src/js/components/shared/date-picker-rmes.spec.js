import React from 'react';
import { shallow } from 'enzyme';
import DatePickerRmes from './date-picker-rmes';

describe('date-picker', () => {
	it('renders without crashing', () => {
		shallow(<DatePickerRmes />);
	});
});
