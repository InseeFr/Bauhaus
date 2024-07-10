import { render, screen } from '@testing-library/react';
import { Auth, RBACMock } from 'js/utils';
import { ViewMenu } from './menu';
import { UNPUBLISHED } from '../../../../new-architecture/model/ValidationState';
describe('Codes List View Menu', () => {
	it('a user can only see the go back button', () => {
		const codesList = { id: '1' };
		render(
			<RBACMock roles={[]}>
				<ViewMenu
					codelist={codesList}
					publish={jest.fn()}
					handleDelete={jest.fn()}
					handleBack={jest.fn()}
					handleUpdate={jest.fn()}
					updatable={true}
					deletable={true}
				></ViewMenu>
			</RBACMock>
		);

		screen.getByText('Back');
		expect(screen.queryByText('Publish')).toBeNull();
		expect(screen.queryByText('Delete')).toBeNull();
		expect(screen.queryByText('Update')).toBeNull();
	});

	it('an admin can goBack, publish, delete and update a codelist even if the stamp is not correct', () => {
		const codesList = { id: '1' };

		render(
			<RBACMock roles={[Auth.ADMIN]}>
				<ViewMenu
					codelist={codesList}
					publish={jest.fn()}
					handleDelete={jest.fn()}
					handleBack={jest.fn()}
					handleUpdate={jest.fn()}
					updatable={true}
					deletable={true}
				></ViewMenu>
			</RBACMock>
		);

		screen.getByText('Back');
		screen.getByText('Publish');
		screen.getByText('Delete');
		screen.getByText('Update');
	});

	it('an Gestionnaire_liste_codes_RMESGNCS can goBack, publish, delete and update a codelist if the stamp is correct and validationState is unpublished', () => {
		const codesList = {
			id: '1',
			contributor: 'INSEE',
			validationState: UNPUBLISHED,
		};

		render(
			<RBACMock roles={[Auth.CODELIST_CONTRIBUTOR]} stamp="INSEE">
				<ViewMenu
					codelist={codesList}
					publish={jest.fn()}
					handleDelete={jest.fn()}
					handleBack={jest.fn()}
					handleUpdate={jest.fn()}
					updatable={true}
					deletable={true}
				></ViewMenu>
			</RBACMock>
		);

		screen.getByText('Back');
		screen.getByText('Publish');
		screen.getByText('Delete');
		screen.getByText('Update');
	});

	it('an Gestionnaire_liste_codes_RMESGNCS can goBack, publish and update a codelist if the stamp is correct and validationState is published', () => {
		const codesList = {
			id: '1',
			contributor: 'INSEE',
			validationState: 'published',
		};

		render(
			<RBACMock roles={[Auth.CODELIST_CONTRIBUTOR]} stamp="INSEE">
				<ViewMenu
					codelist={codesList}
					publish={jest.fn()}
					handleDelete={jest.fn()}
					handleBack={jest.fn()}
					handleUpdate={jest.fn()}
					updatable={true}
					deletable={true}
				></ViewMenu>
			</RBACMock>
		);

		screen.getByText('Back');
		screen.getByText('Publish');
		expect(screen.queryByText('Delete')).toBeNull();
		screen.getByText('Update');
	});

	it('an Gestionnaire_liste_codes_RMESGNCS can only goBack if the stamp not is correct', () => {
		const codesList = { id: '1', contributor: 'INSEE' };

		render(
			<RBACMock roles={[Auth.CODELIST_CONTRIBUTOR]} stamp="XXXXXX">
				<ViewMenu
					codelist={codesList}
					publish={jest.fn()}
					handleDelete={jest.fn()}
					handleBack={jest.fn()}
					handleUpdate={jest.fn()}
					updatable={true}
					deletable={true}
				></ViewMenu>
			</RBACMock>
		);

		screen.getByText('Back');
		expect(screen.queryByText('Publish')).toBeNull();
		expect(screen.queryByText('Delete')).toBeNull();
		expect(screen.queryByText('Update')).toBeNull();
	});
});
