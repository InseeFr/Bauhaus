import { useLocation } from 'react-router-dom';
import { ReturnButton, Button, ActionToolbar } from '@inseefr/wilco';
import D from '../../deprecated-locales';
import { useGoBack } from '../../utils/hooks/useGoBack';
import { ValidationButton } from '../../components';
import Auth from '../../auth/components/auth';
import { ADMIN } from '../../auth/roles';
const ClassificationControls = ({ classification, publish }) => {
	const goBack = useGoBack();
	const location = useLocation();
	const treeLocation = `${location.pathname}/tree`;

	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack('/classifications')} />
			<Auth roles={[ADMIN]}>
				<ValidationButton object={classification} callback={publish} />
			</Auth>
			<Auth roles={[ADMIN]}>
				<Button
					action={`/classifications/classification/${classification.id}/modify`}
					label={D.btnUpdate}
				/>
			</Auth>
			<Button key={D.btnTree} action={treeLocation} label={D.btnTree} col={3} />
		</ActionToolbar>
	);
};

export default ClassificationControls;