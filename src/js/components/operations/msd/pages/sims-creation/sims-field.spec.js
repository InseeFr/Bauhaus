import React from 'react';
import Field from './sims-field';
import { shallow } from 'enzyme';
import { rangeType } from 'js/utils/msd/';
import DatePickerRmes from 'js/components/shared/date-picker-rmes';
import InputRmes from 'js/components/shared/input-rmes';
import EditorMarkdown from 'js/components/shared/editor-markdown';
import SelectRmes from 'js/components/shared/select-rmes';

const { REPORTED_ATTRIBUTE, TEXT, DATE, CODE_LIST } = rangeType;

describe('Sims Field', () => {
	it('if isPresentational is true, should not display any fields', () => {
		const general = shallow(
			<Field
				msd={{
					masLabelLg2: 'masLabelLg2',
					rangeType: TEXT,
					isPresentational: true,
				}}
				codesLists={{}}
			/>
		);
		expect(general.find(InputRmes).length).toBe(0);
		expect(general.find(DatePickerRmes).length).toBe(0);
		expect(general.find(EditorMarkdown).length).toBe(0);
		expect(general.find(SelectRmes).length).toBe(0);
	});
	it('should display only one field', () => {
		const general = shallow(
			<Field
				msd={{
					masLabelLg2: 'masLabelLg2',
					rangeType: TEXT,
					isPresentational: false,
				}}
				codesLists={{}}
			/>
		);
		expect(general.find(InputRmes).length).toBe(1);
	});

	it('when rangeType === DATE, should display a DatePickerRmes', () => {
		const general = shallow(
			<Field
				msd={{
					masLabelLg2: 'masLabelLg2',
					rangeType: DATE,
					isPresentational: false,
				}}
				codesLists={{}}
			/>
		);
		expect(general.find(DatePickerRmes).length).toBe(1);
	});
	it('when rangeType === REPORTED_ATTRIBUTE, should display a EditorMarkdown', () => {
		const general = shallow(
			<Field
				msd={{
					masLabelLg2: 'masLabelLg2',
					rangeType: REPORTED_ATTRIBUTE,
					isPresentational: false,
				}}
				codesLists={{}}
			/>
		);
		expect(general.find(EditorMarkdown).length).toBe(1);
	});
	it('when rangeType === CODE_LIST, should display a SelectRmes', () => {
		const general = shallow(
			<Field
				msd={{
					masLabelLg2: 'masLabelLg2',
					rangeType: CODE_LIST,
					isPresentational: false,
					codeList: 'codeList',
				}}
				currentSection={{ value: 'value' }}
				codesLists={{ codeList: { codes: [] } }}
			/>
		);
		expect(general.find(SelectRmes).length).toBe(1);
	});
});
