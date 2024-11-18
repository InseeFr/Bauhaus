import ConceptEditionCreation, { onGeneralInformationChange } from './home';
import { renderWithRouter } from '../../tests-utils/render';
import { locales } from '../../tests-utils/default-values';
import { empty } from '../utils/general';

vi.mock('./general');

describe('concept-edition-creation', () => {
	it('should update general informations', () => {
		expect(
			onGeneralInformationChange(
				{
					state1: 'state1',
					data: {
						data1: 'data1',
						general: {
							general1: 'general1',
							general2: 'general2',
						},
					},
				},
				{
					general2: 'general21',
					general3: 'general3',
				},
			),
		).toEqual({
			state1: 'state1',
			data: {
				data1: 'data1',
				general: {
					general1: 'general1',
					general2: 'general21',
					general3: 'general3',
				},
			},
		});
	});
	it('renders without crashing', () => {
		renderWithRouter(
			<ConceptEditionCreation
				id="id"
				creation={true}
				title="title"
				general={empty()}
				notes={{}}
				conceptsWithLinks={[]}
				stampList={[]}
				save={vi.fn()}
				langs={locales}
			/>,
		);
	});
});
