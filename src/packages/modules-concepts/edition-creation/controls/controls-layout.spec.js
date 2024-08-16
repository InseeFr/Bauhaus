import ControlsLayout from './controls-layout';
import { renderWithRouter } from '../../../tests-utils/render';

describe('concept-edition-creation-controls-layout', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<ControlsLayout
				message="message"
				saveEnabled={false}
				conceptsWithLinks={[]}
				handleSave={jest.fn()}
				redirectCancel={jest.fn()}
			/>
		);
	});
});
