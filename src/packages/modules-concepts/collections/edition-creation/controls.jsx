import { GlobalClientSideErrorBloc } from '../../../components';
import D from '../../../deprecated-locales/build-dictionary';
import { ActionToolbar } from '../../../components/action-toolbar';
import {
	CancelButton,
	SaveButton,
} from '../../../components/buttons/buttons-with-icons';

function Controls({ handleSave, redirectCancel, errors }) {
	return (
		<>
			<ActionToolbar>
				<CancelButton action={redirectCancel()} />
				<SaveButton
					action={handleSave}
					disabled={errors?.errorMessage?.length > 0}
				/>
			</ActionToolbar>
			<GlobalClientSideErrorBloc
				clientSideErrors={errors?.errorMessage}
				D={D}
			/>
		</>
	);
}

export default Controls;
