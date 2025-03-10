import { screen, render, fireEvent } from '@testing-library/react';

import { XSD_CODE_LIST, XSD_STRING } from '../../utils/constants';
import Representation from './index';

describe('Representation', () => {
	it('should display the label of a XSD_TYPES', async () => {
		const component = {
			range: XSD_STRING,
		};
		const handleCodesListDetail = vi.fn();

		render(
			<Representation
				component={component}
				codesLists={[]}
				handleCodesListDetail={handleCodesListDetail}
			/>,
		);
		await screen.findByText('String');
	});

	it('should display a button with the codeList', async () => {
		const component = {
			range: XSD_CODE_LIST,
			codeList: 'id',
		};
		const codesLists = [{ id: 'id', label: 'label' }];
		const handleCodesListDetail = vi.fn();

		render(
			<Representation
				component={component}
				codesLists={codesLists}
				handleCodesListDetail={handleCodesListDetail}
			/>,
		);
		await screen.findByText('label');
		const button = await screen.findByRole('button');

		fireEvent.click(button);
		expect(handleCodesListDetail).toHaveBeenCalled();
	});
});
