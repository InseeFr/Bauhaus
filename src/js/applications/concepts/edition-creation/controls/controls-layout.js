import { CancelButton, ActionToolbar, SaveButton } from '@inseefr/wilco';
import { GlobalClientSideErrorBloc } from '../../../../new-architecture/components';
import D from '../../../../i18n/build-dictionary';
import { useGoBack } from '../../../../new-architecture/utils/hooks/useGoBack';

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
			{
				<GlobalClientSideErrorBloc
					clientSideErrors={errors?.errorMessage}
					D={D}
				/>
			}
		</>
	);
};

export default ConceptCreateControlLayout;
