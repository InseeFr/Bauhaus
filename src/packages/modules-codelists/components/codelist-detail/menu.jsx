import { ValidationButton } from '@components/validationButton';
import { UNPUBLISHED } from '../../..//model/ValidationState';
import { ADMIN, CODELIST_CONTRIBUTOR } from '../../../auth/roles';
import { usePermission } from '../../../redux/hooks/usePermission';
import { ActionToolbar } from '@components/action-toolbar';
import {
	DeleteButton,
	ReturnButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';
export const ViewMenu = ({
	col,
	handleUpdate,
	handleDelete,
	handleBack,
	codelist,
	publish,
	updatable,
	deletable,
}) => {
	const permission = usePermission();

	const hasRightsBasedOnStamp =
		permission?.stamp === codelist?.contributor &&
		permission?.roles?.includes(CODELIST_CONTRIBUTOR);
	const isAdmin = permission?.roles?.includes(ADMIN);

	return (
		<ActionToolbar>
			<ReturnButton action={handleBack} col={col} />

			{(isAdmin || hasRightsBasedOnStamp) && (
				<ValidationButton callback={publish} object={codelist} />
			)}

			{deletable &&
				(isAdmin ||
					(hasRightsBasedOnStamp &&
						codelist.validationState === UNPUBLISHED)) && (
					<DeleteButton action={handleDelete} col={col} />
				)}

			{updatable && (isAdmin || hasRightsBasedOnStamp) && (
				<UpdateButton action={handleUpdate} col={col} />
			)}
		</ActionToolbar>
	);
};
