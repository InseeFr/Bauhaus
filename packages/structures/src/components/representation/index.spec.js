import { screen, render } from '@testing-library/react';
import Representation from './index';
import React from 'react';
import { XSD_CODE_LIST, XSD_STRING } from '../../utils/constants';

describe('Representation', () => {
	it('should display the label of a XSD_TYPES', async () => {
		const component = {
			range: XSD_STRING
		};
		const codesLists = [];
		const handleCodesListDetail = jest.fn();

		render(
			<Representation
				component={component}
				codesLists={codesLists}
				handleCodesListDetail={handleCodesListDetail}
			/>
		);
		await screen.findByText('String')
	})

	it('should display a buttun with the codeList', async () => {
		const component = {
			range: XSD_CODE_LIST,
			codeList: 'id'
		};
		const codesLists = [{ id: 'id', label: 'label' }];
		const handleCodesListDetail = jest.fn();

		render(
			<Representation
				component={component}
				codesLists={codesLists}
				handleCodesListDetail={handleCodesListDetail}
			/>
		);
		await screen.findByText('label');
		await screen.findByRole('button');
	})
})
