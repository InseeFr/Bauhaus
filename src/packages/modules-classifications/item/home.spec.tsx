import { RBACMock } from '../../tests-utils/rbac';
import {
	mockReactQueryForRbac,
	renderWithAppContext,
} from '../../tests-utils/render';

const item = {
	general: {
		prefLabelLg1: 'Label',
		classificationId: 'id',
		itemId: 'itemId',
		conceptVersion: 'conceptVersion',
	},
	notes: {},
	narrowers: [{ id: '1', label: 'Narrower 1' }],
};

describe('classification-item-home', () => {
	it('renders without crashing', async () => {
		mockReactQueryForRbac([]);

		const { default: Home } = await import('./home');

		renderWithAppContext(
			<RBACMock roles={[]}>
				<Home item={item} secondLang={true} />
			</RBACMock>,
			false,
		);
	});
});
