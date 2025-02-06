import { Component } from '@model/structures/Component';

import { ActionToolbar } from '@components/action-toolbar';
import {
	DeleteButton,
	ReturnButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';
import { ValidationButton } from '@components/validationButton';

import { ADMIN, STRUCTURE_CONTRIBUTOR } from '../../../auth/roles';
import { UNPUBLISHED } from '../../../model/ValidationState';
import { usePermission } from '../../../redux/hooks/usePermission';

const canBeDeleted = (component: Component) => {
	const withoutStructuresUsingThisComponent =
		!component.structures || component.structures?.length === 0;
	return withoutStructuresUsingThisComponent;
};

interface ViewMenuTypes {
	component: Component;
	handleUpdate: VoidFunction;
	publish: VoidFunction;
	handleDelete: VoidFunction;
	handleBack: VoidFunction;
	updatable: boolean;
}

export const ViewMenu = ({
	component,
	handleUpdate,
	publish,
	handleDelete,
	handleBack,
	updatable,
}: Readonly<ViewMenuTypes>) => {
	const permission = usePermission();

	const hasRightsBasedOnStamp =
		permission?.stamp === component?.contributor &&
		permission?.roles?.includes(STRUCTURE_CONTRIBUTOR);
	const isAdmin = permission?.roles?.includes(ADMIN);

	return (
		<ActionToolbar>
			<ReturnButton action={handleBack} />

			{(isAdmin || hasRightsBasedOnStamp) && (
				<ValidationButton callback={publish} object={component} />
			)}

			{canBeDeleted(component) &&
				(isAdmin ||
					(hasRightsBasedOnStamp &&
						component.validationState === UNPUBLISHED)) && (
					<DeleteButton action={handleDelete} />
				)}

			{updatable && (isAdmin || hasRightsBasedOnStamp) && (
				<UpdateButton action={handleUpdate} />
			)}
		</ActionToolbar>
	);
};
