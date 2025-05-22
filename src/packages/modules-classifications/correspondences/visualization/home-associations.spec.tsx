import { renderWithRouter } from '../../../tests/render';
import HomeAssociations from './home-associations';

const associations = [
	{
		id: 'A-A',
		sourceLabelLg1: 'Source label',
		sourceId: 'A',
		targetLabelLg1: 'Target label',
		targetId: 'A',
	},
];

const correspondence = {
	id: 'id',
	labelLg1: 'labelLg1',
	idFirstClass: 'idFirstClass',
	firstClassLabelLg1: 'firstClassLabelLg1',
	idSecondClass: 'idSecondClass',
	secondClassLabelLg1: 'secondClassLabelLg1',
};

describe('correspondence-home-associations', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<HomeAssociations
				id="id"
				associations={associations}
				correspondence={correspondence}
				secondLang={false}
			/>,
		);
	});
});
