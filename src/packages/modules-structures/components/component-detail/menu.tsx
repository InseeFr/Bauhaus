import { Component } from '@model/structures/Component';

import { ActionToolbar } from '@components/action-toolbar';
import {
	DeleteButton,
	ReturnButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';
import { ValidationButton } from '@components/validationButton';

import { HasAccess } from '../../../auth/components/auth';
import { UNPUBLISHED } from '../../../model/ValidationState';

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
	return (
		<ActionToolbar>
			<ReturnButton action={handleBack} />

			<HasAccess
				module="STRUCTURE_COMPONENT"
				privilege="PUBLISH"
				stamps={component?.contributor}
			>
				<ValidationButton callback={publish} object={component} />
			</HasAccess>

			{canBeDeleted(component) && (
				<HasAccess
					module="STRUCTURE_COMPONENT"
					privilege="DELETE"
					stamps={component?.contributor}
					complementaryCheck={component.validationState === UNPUBLISHED}
				>
					<DeleteButton action={handleDelete} />
				</HasAccess>
			)}

			{updatable && (
				<HasAccess
					module="STRUCTURE_COMPONENT"
					privilege="UPDATE"
					stamps={component?.contributor}
				>
					<UpdateButton action={handleUpdate} />
				</HasAccess>
			)}
		</ActionToolbar>
	);
};
