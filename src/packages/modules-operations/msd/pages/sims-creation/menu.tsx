import { ActionToolbar } from '../../../../components/action-toolbar';
import {
	CancelButton,
	SaveButton,
} from '../../../../components/buttons/buttons-with-icons';

type MenuTypes = {
	goBackUrl: () => void;
	handleSubmit: () => void;
};
export const Menu = ({ goBackUrl, handleSubmit }: Readonly<MenuTypes>) => {
	return (
		<ActionToolbar>
			<CancelButton action={goBackUrl} />
			<SaveButton action={handleSubmit} />
		</ActionToolbar>
	);
};
