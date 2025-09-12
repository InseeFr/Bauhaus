import { renderWithRouter } from '../../tests/render';
import { Picker } from './';

const items = [{ id: '1', label: 'Item 1' }];

describe('picker-page', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<Picker
				items={items}
				title="title"
				panelTitle="panelTitle"
				labelWarning="labelWarning"
				handleAction={vi.fn()}
				context="concepts"
				ValidationButton={() => <></>}
			/>,
		);
	});
});
