import { Provider } from 'react-redux';
import { vi } from 'vitest';

import { Structure } from '../../model/structures/Structure';
import configureStore from '../../redux/configure-store';
import {
	mockReactQueryForRbac,
	renderWithAppContext,
} from '../../tests-utils/render';

vi.mock('./components/global-informations-panel', () => ({
	GlobalInformationsPanel: vi.fn(() => <div></div>),
}));

vi.mock('./components/descriptions-panel', () => ({
	DescriptionsPanel: vi.fn(() => <div></div>),
}));

vi.mock('./components/components-panel', () => ({
	ComponentsPanel: vi.fn(() => <div></div>),
}));

const store = configureStore({
	users: {
		results: {
			stamp: 'stamp',
		},
	},
	app: {
		auth: {
			user: {
				roles: [],
			},
		},
	},
});

describe('<StructureView />', () => {
	afterEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});
	it('should display labelLg1', async () => {
		mockReactQueryForRbac([]);
		const { StructureView } = await import('./index');

		const { container } = renderWithAppContext(
			<Provider store={store}>
				<StructureView
					publish={vi.fn()}
					structure={
						{
							labelLg1: 'labelLg1',
						} as Structure
					}
				></StructureView>
			</Provider>,
		);

		expect(container.querySelector('h2')!.innerHTML).toEqual('labelLg1');
	});
});
