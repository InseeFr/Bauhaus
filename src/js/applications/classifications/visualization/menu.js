import { useLocation } from 'react-router-dom';
import { ReturnButton, Button, ActionToolbar } from '@inseefr/wilco';
import { Auth } from '../../../utils';
import D from '../../../i18n';
import { useGoBack } from '../../../hooks/hooks';
import { ValidationButton } from '../../../new-architecture/components';
const ClassificationControls = ({ classification, publish }) => {
	const goBack = useGoBack();
	const location = useLocation();
	const treeLocation = `${location.pathname}/tree`;

	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack('/classifications')} />
			<Auth.AuthGuard roles={[Auth.ADMIN]}>
				<ValidationButton object={classification} callback={publish} />
			</Auth.AuthGuard>
			<Auth.AuthGuard roles={[Auth.ADMIN]}>
				<Button
					action={`/classifications/classification/${classification.id}/modify`}
					label={D.btnUpdate}
				/>
			</Auth.AuthGuard>
			<Button key={D.btnTree} action={treeLocation} label={D.btnTree} col={3} />
		</ActionToolbar>
	);
};

export default ClassificationControls;
