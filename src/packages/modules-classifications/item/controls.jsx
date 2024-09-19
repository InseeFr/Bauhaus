import D from '../../deprecated-locales';
import { useGoBack } from '../../utils/hooks/useGoBack';
import Auth from '../../auth/components/auth';
import { ADMIN } from '../../auth/roles';
import { ActionToolbar } from '../../components/action-toolbar';
import { Button } from '../../components/buttons/button';

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
			<Auth roles={[ADMIN]}>
				<Button
					action={`/classifications/classification/${classificationId}/item/${itemId}/modify`}
					label={D.btnUpdate}
				/>
			</Auth>
		</ActionToolbar>
	);
};

export default ItemControls;
