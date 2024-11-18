import { UNPUBLISHED } from '../../../model/ValidationState';
import { ADMIN, STRUCTURE_CONTRIBUTOR } from '../../../auth/roles';
import { usePermission } from '../../../redux/hooks/usePermission';
import { ActionToolbar } from '@components/action-toolbar';
import {
	DeleteButton,
	ReturnButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';
import { ValidationButton } from '@components/validationButton';
const canBeDeleted = (component) => {
	const withoutStructuresUsingThisComponent =
		!component.structures || component.structures?.length === 0;
	return withoutStructuresUsingThisComponent;
};

export const ViewMenu = ({
	component,
	handleUpdate,
	publish,
	handleDelete,
	handleBack,
	updatable,
	col,
}) => {
	const permission = usePermission();

	const hasRightsBasedOnStamp =
		permission?.stamp === component?.contributor &&
		permission?.roles?.includes(STRUCTURE_CONTRIBUTOR);
	const isAdmin = permission?.roles?.includes(ADMIN);

	return (
		<ActionToolbar>
			<ReturnButton action={handleBack} col={col} />

			{(isAdmin || hasRightsBasedOnStamp) && (
				<ValidationButton callback={publish} object={component} />
			)}

			{canBeDeleted(component) &&
				(isAdmin ||
					(hasRightsBasedOnStamp &&
						component.validationState === UNPUBLISHED)) && (
					<DeleteButton action={handleDelete} col={col} />
				)}

			{updatable && (isAdmin || hasRightsBasedOnStamp) && (
				<UpdateButton action={handleUpdate} col={col} />
			)}
		</ActionToolbar>
	);
};
