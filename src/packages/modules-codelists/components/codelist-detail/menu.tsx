import { ActionToolbar } from '@components/action-toolbar';
import {
	DeleteButton,
	ReturnButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';
import { ValidationButton } from '@components/validationButton';

import { UNPUBLISHED } from '../../..//model/ValidationState';
import { ADMIN, CODELIST_CONTRIBUTOR } from '../../../auth/roles';
import { usePermission } from '../../../redux/hooks/usePermission';

interface ViewMenuTypes {
	handleUpdate: VoidFunction;
	handleDelete: VoidFunction;
	handleBack: VoidFunction;
	publish: VoidFunction;
	updatable: boolean;
	deletable: boolean;
	codelist: any;
}

export const ViewMenu = ({
	handleUpdate,
	handleDelete,
	handleBack,
	codelist,
	publish,
	updatable,
	deletable,
}: Readonly<ViewMenuTypes>) => {
	const permission = usePermission();

	const hasRightsBasedOnStamp =
		permission?.stamp === codelist?.contributor &&
		permission?.roles?.includes(CODELIST_CONTRIBUTOR);
	const isAdmin = permission?.roles?.includes(ADMIN);

	return (
		<ActionToolbar>
			<ReturnButton action={handleBack} />

			{(isAdmin || hasRightsBasedOnStamp) && (
				<ValidationButton callback={publish} object={codelist} />
			)}

			{deletable &&
				(isAdmin ||
					(hasRightsBasedOnStamp &&
						codelist.validationState === UNPUBLISHED)) && (
					<DeleteButton action={handleDelete} />
				)}

			{updatable && (isAdmin || hasRightsBasedOnStamp) && (
				<UpdateButton action={handleUpdate} />
			)}
		</ActionToolbar>
	);
};
