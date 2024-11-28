import { ActionToolbar } from '@components/action-toolbar';
import { Button } from '@components/buttons/button';
import {
	ReturnButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';

import { useGoBack } from '@utils/hooks/useGoBack';

import Auth from '../../auth/components/auth';
import { ADMIN } from '../../auth/roles';
import D from '../../deprecated-locales';

type ItemControls = {
	classificationId: string;
	itemId: string;
	version?: number;
};
const ItemControls = ({
	classificationId,
	itemId,
	version,
}: Readonly<ItemControls>) => {
	const goBack = useGoBack();
	const compare =
		!version || version <= 1
			? null
			: [
					`/classifications/classification/${classificationId}/item/${itemId}/compare`,
					D.btnCompare,
				];
	const btns = [compare];

	return (
		<ActionToolbar>
			<ReturnButton
				action={() =>
					goBack(`/classifications/classification/${classificationId}/items`)
				}
			/>
			{btns.map((btn) => {
				if (!btn) return null;
				const [action, label] = btn;
				return btn && <Button key={label} action={action} label={label} />;
			})}
			<Auth roles={[ADMIN]}>
				<UpdateButton
					action={`/classifications/classification/${classificationId}/item/${itemId}/modify`}
				/>
			</Auth>
		</ActionToolbar>
	);
};

export default ItemControls;
