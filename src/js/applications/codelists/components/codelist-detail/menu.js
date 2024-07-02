import { Auth, ValidationButton } from 'js/utils';
import {
	ActionToolbar,
	DeleteButton,
	ReturnButton,
	UpdateButton,
} from '@inseefr/wilco';
import { useSelector } from 'react-redux';

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
	const permission = useSelector(Auth.getPermission);

	const hasRightsBasedOnStamp =
		permission?.stamp === codelist?.contributor &&
		permission?.roles?.includes(Auth.CODELIST_CONTRIBUTOR);
	const isAdmin = permission?.roles?.includes(Auth.ADMIN);

	return (
		<ActionToolbar>
			<ReturnButton action={handleBack} col={col} />

			{(isAdmin || hasRightsBasedOnStamp) && (
				<ValidationButton callback={publish} object={codelist} />
			)}

			{deletable &&
				(isAdmin ||
					(hasRightsBasedOnStamp &&
						codelist.validationState === 'Unpublished')) && (
					<DeleteButton action={handleDelete} col={col} />
				)}

			{updatable && (isAdmin || hasRightsBasedOnStamp) && (
				<UpdateButton action={handleUpdate} col={col} />
			)}
		</ActionToolbar>
	);
};
