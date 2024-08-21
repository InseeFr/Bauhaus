import {
	ActionToolbar,
	DeleteButton,
	ReturnButton,
	UpdateButton,
} from '@inseefr/wilco';
import { useSelector } from 'react-redux';
import { UNPUBLISHED } from '../../..//model/ValidationState';
import { ValidationButton } from '../../../components';
import { ADMIN, CODELIST_CONTRIBUTOR } from '../../../auth/roles';
import { getPermission } from '../../../redux/selectors';
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
	const permission = useSelector(getPermission);

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