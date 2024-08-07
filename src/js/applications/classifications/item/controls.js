import { Button, ActionToolbar } from '@inseefr/wilco';
import D from '../../../i18n';
import { Auth } from '../../../utils';
import { useGoBack } from '../../../new-architecture/utils/hooks/useGoBack';

const ItemControls = ({ classificationId, itemId, version }) => {
	const goBack = useGoBack();

	const cancel = [
		() => goBack(`/classifications/classification/${classificationId}/items`),
		D.btnReturn,
	];
	const compare =
		!version || version <= 1
			? null
			: [
					`/classifications/classification/${classificationId}/item/${itemId}/compare`,
					D.btnCompare,
			  ];
	const btns = [cancel, compare];

	return (
		<ActionToolbar>
			{btns.map((btn) => {
				if (!btn) return null;
				const [action, label] = btn;
				return btn && <Button key={label} action={action} label={label} />;
			})}
			<Auth.AuthGuard roles={[Auth.ADMIN]}>
				<Button
					action={`/classifications/classification/${classificationId}/item/${itemId}/modify`}
					label={D.btnUpdate}
				/>
			</Auth.AuthGuard>
		</ActionToolbar>
	);
};

export default ItemControls;
