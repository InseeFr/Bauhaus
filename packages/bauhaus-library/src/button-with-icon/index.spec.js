import React from 'react';
import { shallow } from 'enzyme';
import AbstractButton, {
	ExportButton,
	PublishButton,
	NewButton,
	CancelButton,
	SaveButton,
	DuplicateButton,
} from './';
import Button from '../button';

describe('AbstractButton', () => {
	it('should call Button', () => {
		const wrapper = shallow(<AbstractButton label="" action="" />);
		expect(wrapper.find(Button).length).toBe(1);
	});
});
describe('ExportButton', () => {
	it('should call AbstractButton', () => {
		const wrapper = shallow(<ExportButton label="" action="" />);
		expect(wrapper.find(AbstractButton).length).toBe(1);
		expect(wrapper.find(AbstractButton).get(0).props.icon).toBe('export');
	});
});
describe('PublishButton', () => {
	it('should call AbstractButton', () => {
		const wrapper = shallow(<PublishButton label="" action="" />);
		expect(wrapper.find(AbstractButton).length).toBe(1);
		expect(wrapper.find(AbstractButton).get(0).props.icon).toBe('ok');
	});
});
describe('NewButton', () => {
	it('should call AbstractButton', () => {
		const wrapper = shallow(<NewButton label="" action="" />);
		expect(wrapper.find(AbstractButton).length).toBe(1);
		expect(wrapper.find(AbstractButton).get(0).props.icon).toBe('plus');
	});
});
describe('CancelButton', () => {
	it('should call AbstractButton', () => {
		const wrapper = shallow(<CancelButton label="" action="" />);
		expect(wrapper.find(AbstractButton).length).toBe(1);
		expect(wrapper.find(AbstractButton).get(0).props.icon).toBe(
			'floppy-remove'
		);
	});
});
describe('SaveButton', () => {
	it('should call AbstractButton', () => {
		const wrapper = shallow(<SaveButton label="" action="" />);
		expect(wrapper.find(AbstractButton).length).toBe(1);
		expect(wrapper.find(AbstractButton).get(0).props.icon).toBe('floppy-disk');
	});
});
describe('DuplicateButton', () => {
	it('should call AbstractButton', () => {
		const wrapper = shallow(<DuplicateButton label="" action="" />);
		expect(wrapper.find(AbstractButton).length).toBe(1);
		expect(wrapper.find(AbstractButton).get(0).props.icon).toBe('duplicate');
	});
});
