import React from 'react';
import { shallow } from 'enzyme';
import OperationVisualization from './home';
import { Note } from 'js/components/shared/note';

const langs = {
	lg1: 'fr',
	lg2: 'en',
};
describe('OperationVisualization', () => {
	it('should renderer all informations for the main lang', () => {
		const attr = {
			prefLabelLg1: 'prefLabelLg1',
			prefLabelLg2: 'prefLabelLg2',
			intitule1: 'intitule1',
			altLabel1: 'altLabel1',
			millesime: 'millesime',
		};
		const general = shallow(
			<OperationVisualization
				attr={attr}
				exportVarBook={() => {}}
				saveSecondLang={() => {}}
				langs={langs}
				secondLang={false}
				isModalOpen={false}
				closeModal={() => {}}
			/>
		);
		expect(general.find(Note).length).toBe(3);
	});

	it('should renderer all informations for the second lang', () => {
		const attr = {
			prefLabelLg1: 'prefLabelLg1',
			prefLabelLg2: 'prefLabelLg2',
			intitule1: 'intitule1',
			altLabel1: 'altLabel1',
			millesime: 'millesime',
			intitule2: 'intitule2',
			altLabel2: 'altLabel2',
		};
		const general = shallow(
			<OperationVisualization
				attr={attr}
				secondLang={true}
				exportVarBook={() => {}}
				saveSecondLang={() => {}}
				langs={langs}
				secondLang={true}
				isModalOpen={false}
				closeModal={() => {}}
			/>
		);
		expect(general.find(Note).length).toBe(5);
	});
});
