import { ActionToolbar } from '@components/action-toolbar';
import {
	ReturnButton,
	SaveButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';

import { ADMIN, CODELIST_CONTRIBUTOR } from '../../../auth/roles';
import { usePermission } from '../../../redux/hooks/usePermission';

export const CodeSlidingPanelMenu = ({
	codelist,
	handleSubmit,
	handleBack,
	creation,
}) => {
	const permission = usePermission();

	const hasRightsBasedOnStamp =
		permission?.stamp === codelist?.contributor &&
		permission?.roles?.includes(CODELIST_CONTRIBUTOR);
	const isAdmin = permission?.roles?.includes(ADMIN);

	return (
		<ActionToolbar>
			<ReturnButton action={handleBack} col={6} />
			{(isAdmin || hasRightsBasedOnStamp) && (
				<>
					{!creation && <UpdateButton action={handleSubmit} col={6} />}
					{creation && <SaveButton action={handleSubmit} col={6} />}
				</>
			)}
		</ActionToolbar>
	);
};
