import { GlobalClientSideErrorBloc } from '../../../components';
import D from '../../../deprecated-locales/build-dictionary';
import { ActionToolbar } from '../../../components/action-toolbar';
import {
	CancelButton,
	SaveButton,
} from '../../../components/buttons/buttons-with-icons';
import { createAllDictionary } from '../../../utils/dictionnary';

const { D: dict } = createAllDictionary({
	errors: {
		GlobalClientSideErrorBloc: {
			fr: 'Remplissez les champs requis pour pouvoir sauvegarder cette collection.',
			en: 'Complete mandatory fields to save this collection.',
		},
	},
});

function Controls({ handleSave, redirectCancel, errors, submitting }) {
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
				D={submitting ? D : dict}
			/>
		</>
	);
}

export default Controls;
