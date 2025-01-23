import { CodesList } from '@model/CodesList';

import { ActionToolbar } from '@components/action-toolbar';
import {
	ReturnButton,
	SaveButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';

import { ADMIN, CODELIST_CONTRIBUTOR } from '../../../auth/roles';
import { usePermission } from '../../../redux/hooks/usePermission';

interface CodeSlidingPanelMenuTypes {
	codelist: CodesList;
	handleSubmit: VoidFunction;
	handleBack: VoidFunction;
	creation: boolean;
}
export const CodeSlidingPanelMenu = ({
	codelist,
	handleSubmit,
	handleBack,
	creation,
}: Readonly<CodeSlidingPanelMenuTypes>) => {
	const permission = usePermission();

	const hasRightsBasedOnStamp =
		permission?.stamp === codelist?.contributor &&
		permission?.roles?.includes(CODELIST_CONTRIBUTOR);
	const isAdmin = permission?.roles?.includes(ADMIN);

	return (
		<ActionToolbar>
			<ReturnButton action={handleBack} />
			{(isAdmin || hasRightsBasedOnStamp) && (
				<>
					{!creation && <UpdateButton action={handleSubmit} />}
					{creation && <SaveButton action={handleSubmit} />}
				</>
			)}
		</ActionToolbar>
	);
};
