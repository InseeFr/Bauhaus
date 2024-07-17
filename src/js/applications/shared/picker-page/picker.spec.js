import PagePicker from './';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';
const items = [{ id: '1', label: 'Item 1' }];

describe('picker-page', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<PagePicker
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
