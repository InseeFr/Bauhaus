import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import configureStore from '../../../../redux/configure-store';
import { rangeType } from '../../../utils/msd';
import Field from './sims-field';

const store = configureStore({ operationsDocuments: {} });

const { RICH_TEXT, TEXT, DATE, CODE_LIST } = rangeType;

describe('Sims Field', () => {
	it('if isPresentational is true, should not display any fields', () => {
		const { container } = render(
			<Field
				msd={{
					masLabelLg2: 'masLabelLg2',
					rangeType: TEXT,
					isPresentational: true,
				}}
				codesLists={{}}
			/>,
		);
		expect(container).toBeEmptyDOMElement();
	});
	it('should display only one field', () => {
		const { container } = render(
			<Field
				msd={{
					masLabelLg2: 'masLabelLg2',
					rangeType: TEXT,
					isPresentational: false,
				}}
				codesLists={{}}
				alone={true}
			/>,
		);
		expect(container.querySelectorAll('input')).toHaveLength(1);
	});

	it('when rangeType === DATE, should display a DatePickerRmes', () => {
		const { container } = render(
			<Field
				msd={{
					masLabelLg2: 'masLabelLg2',
					rangeType: DATE,
					isPresentational: false,
				}}
				codesLists={{}}
				alone={true}
			/>,
		);

		expect(container.querySelectorAll('.p-calendar')).toHaveLength(1);
	});

	it('when rangeType === RICH_TEXT, should display a EditorMarkdown', () => {
		const { container } = render(
			<Provider store={store}>
				<Field
					msd={{
						masLabelLg2: 'masLabelLg2',
						rangeType: RICH_TEXT,
						isPresentational: false,
					}}
					codesLists={{}}
					alone={true}
				/>
			</Provider>,
		);

		expect(container.querySelectorAll('.rdw-editor-wrapper')).toHaveLength(1);
	});
	it('when rangeType === CODE_LIST, should display a SelectRmes', () => {
		const { container } = render(
			<Field
				msd={{
					masLabelLg1: 'masLabelLg1',
					rangeType: CODE_LIST,
					isPresentational: false,
					codeList: 'codeList',
					idMas: '1',
				}}
				currentSection={{ value: 'value' }}
				codesLists={{ codeList: { codes: [] } }}
				alone={true}
				secondLang={false}
				lang="fr"
			/>,
		);
		expect(container.querySelectorAll('.p-dropdown')).toHaveLength(1);
	});
});
