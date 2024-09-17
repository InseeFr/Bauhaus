import { useParams } from 'react-router-dom';
import { cleanId } from '@inseefr/wilco';
import { ActionToolbar } from '../../components/action-toolbar';
import {
	ReturnButton,
	SaveButton,
} from '../../components/buttons/buttons-with-icons';

type ControlsTypes = {
	creation: boolean;
	save: () => void;
	disabledSave?: boolean;
};
const Controls = ({ creation, save, disabledSave }: ControlsTypes) => {
	const { structureId } = useParams<{ structureId: string }>();
	return (
		<ActionToolbar>
			<ReturnButton
				action={
					creation ? '/structures' : `/structures/${cleanId(structureId)}`
				}
			/>

			<SaveButton action={save} disabled={disabledSave} />
		</ActionToolbar>
	);
};

export default Controls;
