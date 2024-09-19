import { useLocation } from 'react-router-dom';
import D from '../../deprecated-locales';
import { useGoBack } from '../../utils/hooks/useGoBack';
import { ValidationButton } from '../../components';
import Auth from '../../auth/components/auth';
import { ADMIN } from '../../auth/roles';
import { ActionToolbar } from '../../components/action-toolbar';
import { ReturnButton } from '../../components/buttons/buttons-with-icons';
import { Button } from '../../components/buttons/button';
import { Classification } from '../../model/Classification';

type ClassificationControlsTypes = {
	classification: Classification;
	publish: () => void;
};

const ClassificationControls = ({
	classification,
	publish,
}: Readonly<ClassificationControlsTypes>) => {
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
			<Button key={D.btnTree} action={treeLocation} label={D.btnTree} />
		</ActionToolbar>
	);
};

export default ClassificationControls;
