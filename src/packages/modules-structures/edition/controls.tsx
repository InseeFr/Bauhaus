import { useParams } from 'react-router-dom';
import {
	cleanId,
	ReturnButton,
	ActionToolbar,
	SaveButton,
} from '@inseefr/wilco';

type ControlsTypes = {
	creation: boolean;
	save: () => void;
	disabledSave?: boolean
}
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
