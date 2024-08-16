import {
	ActionToolbar,
	DeleteButton,
	ReturnButton,
	UpdateButton,
} from '@inseefr/wilco';
import { useSelector } from 'react-redux';
import { UNPUBLISHED } from '../../../model/ValidationState';
import { ValidationButton } from '../../../components';
import { ADMIN, STRUCTURE_CONTRIBUTOR } from '../../../auth/roles';
import { getPermission } from '../../../redux/selectors';
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
	const permission = useSelector(getPermission);

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
