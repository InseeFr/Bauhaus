import { Picker } from './';
import { renderWithRouter } from '../../tests-utils/render';
const items = [{ id: '1', label: 'Item 1' }];

describe('picker-page', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<Picker
				items={items}
				title="title"
				panelTitle="panelTitle"
				labelWarning="labelWarning"
				labelValidateButton="labelValidateButton"
				handleAction={jest.fn()}
				context="concepts"
			/>
		);
	});
});
