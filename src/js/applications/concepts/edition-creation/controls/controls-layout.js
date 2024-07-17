import { withRouter } from 'react-router-dom';
import { CancelButton, ActionToolbar, SaveButton } from '@inseefr/wilco';
import { GlobalClientSideErrorBloc } from '../../../../utils';
import D from '../../../../i18n/build-dictionary';

const ConceptCreateControlLayout = ({ errors, handleSave, redirectCancel }) => {
	return (
		<>
			<ActionToolbar>
				<CancelButton action={redirectCancel} />
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

export default withRouter(ConceptCreateControlLayout);
