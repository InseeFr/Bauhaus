import { useLocation } from 'react-router-dom';
import Auth from '../../auth/components/auth';
import { ADMIN } from '../../auth/roles';
import { ValidationButton } from '../../components';
import { ActionToolbar } from '../../components/action-toolbar';
import { Button } from '../../components/buttons/button';
import {
	ReturnButton,
	UpdateButton,
} from '../../components/buttons/buttons-with-icons';
import D from '../../deprecated-locales';
import { Classification } from '../../model/Classification';
import { useGoBack } from '../../utils/hooks/useGoBack';

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
				<UpdateButton
					action={`/classifications/classification/${classification.id}/modify`}
				/>
			</Auth>
			<Button key={D.btnTree} action={treeLocation} label={D.btnTree} />
		</ActionToolbar>
	);
};

export default ClassificationControls;
