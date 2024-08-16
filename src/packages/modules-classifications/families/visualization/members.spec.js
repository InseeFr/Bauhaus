import Members from './members';
import { renderWithRouter } from '../../../tests-utils/render';

const members = [{ id: '1', label: 'Member 1' }];

describe('classification-family-members', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Members members={members} secondLang={true} />);
	});
});
