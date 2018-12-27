import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import HelpInformation from './';
import { rangeType } from 'js/utils/msd/';
const { CODE_LIST, TEXT } = rangeType;

describe('HelpInformation', () => {
	it('should return null if the masLabelLg1 is undefined', () => {
		const instance = shallow(<HelpInformation msd={{}} />);
		expect(instance.html()).toBeNull();
	});

	it('should display the right content when the rangeType is a CODE_LIST', () => {
		const msd = {
			masLabelLg1: 'masLabelLg1',
			masLabelLg2: 'masLabelLg2',
			isPresentational: true,
			rangeType: CODE_LIST,
			codeList: 'codeList',
		};
		const codesLists = {
			codeList: {
				codeListLabelLg1: 'codeListLabelLg1',
				codes: [{ code: 'code1' }, { code: 'code2' }],
			},
		};
		const tree = renderer
			.create(<HelpInformation msd={msd} codesLists={codesLists} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should display the right content when the rangeType is not a CODE_LIST', () => {
		const msd = {
			masLabelLg1: 'masLabelLg1',
			masLabelLg2: 'masLabelLg2',
			isPresentational: true,
			rangeType: TEXT,
		};
		const tree = renderer.create(<HelpInformation msd={msd} />).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
