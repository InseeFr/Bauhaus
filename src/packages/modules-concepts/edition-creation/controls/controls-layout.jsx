import { CancelButton, SaveButton } from '@inseefr/wilco';
import { GlobalClientSideErrorBloc } from '../../../components';
import D from '../../../deprecated-locales/build-dictionary';
import { useGoBack } from '../../../utils/hooks/useGoBack';
import { ActionToolbar } from '../../../components/action-toolbar';

const ConceptCreateControlLayout = ({ errors, handleSave }) => {
	const goBack = useGoBack();

	return (
		<>
			<ActionToolbar>
				<CancelButton action={() => goBack('concepts')} />
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
};

export default ConceptCreateControlLayout;
