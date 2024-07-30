import { Auth } from '../../../../utils';
import {
	ActionToolbar,
	DeleteButton,
	ReturnButton,
	UpdateButton,
} from '@inseefr/wilco';
import { useSelector } from 'react-redux';
import { UNPUBLISHED } from '../../../../new-architecture/model/ValidationState';
import { ValidationButton } from '../../../../new-architecture/components';
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
	const permission = useSelector(Auth.getPermission);

	const hasRightsBasedOnStamp =
		permission?.stamp === component?.contributor &&
		permission?.roles?.includes(Auth.STRUCTURE_CONTRIBUTOR);
	const isAdmin = permission?.roles?.includes(Auth.ADMIN);

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
