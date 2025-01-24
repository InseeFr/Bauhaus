import { ActionToolbar } from '@components/action-toolbar';
import {
	CancelButton,
	SaveButton,
} from '@components/buttons/buttons-with-icons';

import { useGoBack } from '@utils/hooks/useGoBack';

export const Menu = ({
	onSubmit,
	onSubmitDisabled,
}: Readonly<{ onSubmit: VoidFunction; onSubmitDisabled: boolean }>) => {
	const goBack = useGoBack();
	return (
		<ActionToolbar>
			<CancelButton action={() => goBack('/datasets/distributions')} />
			<SaveButton action={onSubmit} disabled={onSubmitDisabled} />
		</ActionToolbar>
	);
};
