import { useLocation } from 'react-router-dom';

import { ActionToolbar } from '@components/action-toolbar';
import { Button } from '@components/buttons/button';
import {
	ReturnButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';
import { ValidationButton } from '@components/validationButton';

import { HasAccess } from '../../auth/components/auth';
import D from '../../deprecated-locales';
import { Classification } from '../../model/Classification';
import { useGoBack } from '../../utils/hooks/useGoBack';

interface ClassificationControlsTypes {
	classification: Classification;
	publish: VoidFunction;
}

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
			<HasAccess module="CLASSIFICATION_CLASSIFICATION" privilege="PUBLISH">
				<ValidationButton object={classification} callback={publish} />
			</HasAccess>
			<HasAccess module="CLASSIFICATION_CLASSIFICATION" privilege="UPDATE">
				<UpdateButton
					action={`/classifications/classification/${classification.id}/modify`}
				/>
			</HasAccess>
			<Button key={D.btnTree} action={treeLocation} label={D.btnTree} />
		</ActionToolbar>
	);
};

export default ClassificationControls;
