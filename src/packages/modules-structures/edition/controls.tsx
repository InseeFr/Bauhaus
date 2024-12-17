import { useParams } from 'react-router-dom';

import { ActionToolbar } from '@components/action-toolbar';
import {
	CancelButton,
	SaveButton,
} from '@components/buttons/buttons-with-icons';

import { cleanId } from '@utils/string-utils';

interface ControlsTypes {
	creation: boolean;
	save: () => void;
	disabledSave?: boolean;
}
const Controls = ({ creation, save, disabledSave }: ControlsTypes) => {
	const { structureId } = useParams<{ structureId: string }>();
	return (
		<ActionToolbar>
			<CancelButton
				action={
					creation ? '/structures' : `/structures/${cleanId(structureId)}`
				}
			/>
			<SaveButton action={save} disabled={disabledSave} />
		</ActionToolbar>
	);
};

export default Controls;
