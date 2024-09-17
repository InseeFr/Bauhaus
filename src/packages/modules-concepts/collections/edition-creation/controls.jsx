import { CancelButton, SaveButton } from '@inseefr/wilco';
import { GlobalClientSideErrorBloc } from '../../../components';
import D from '../../../deprecated-locales/build-dictionary';
import { ActionToolbar } from '../../../components/action-toolbar';

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
