import { ActionToolbar } from '@components/action-toolbar';
import {
	CancelButton,
	SaveButton,
} from '@components/buttons/buttons-with-icons';

export const Menu = () => {
	return (
		<ActionToolbar>
			<CancelButton action="/classifications" type="button"></CancelButton>
			<SaveButton type="submit"></SaveButton>
		</ActionToolbar>
	);
};
