import { ActionToolbar } from '@components/action-toolbar';
import {
	CancelButton,
	SaveButton,
} from '@components/buttons/buttons-with-icons';
import { GlobalClientSideErrorBloc } from '@components/errors-bloc';

import { createAllDictionary } from '@utils/dictionnary';
import { useGoBack } from '@utils/hooks/useGoBack';

import D from '../../../deprecated-locales/build-dictionary';

const { D: dict } = createAllDictionary({
	errors: {
		GlobalClientSideErrorBloc: {
			fr: 'Remplissez les champs requis pour pouvoir sauvegarder ce concept.',
			en: 'Complete mandatory fields to save this concept.',
		},
	},
});

const ConceptCreateControlLayout = ({ errors, handleSave, submitting }) => {
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
				D={submitting ? D : dict}
			/>
		</>
	);
};

export default ConceptCreateControlLayout;
