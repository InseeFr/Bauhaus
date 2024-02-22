import React from 'react';
import { useParams } from 'react-router-dom';
import {
	cleanId,
	ReturnButton,
	ActionToolbar,
	SaveButton,
} from '@inseefr/wilco';

const Controls = ({ creation, save, disabledSave }) => {
	const { structureId } = useParams();
	return (
		<ActionToolbar>
			<ReturnButton
				action={creation ? '/structures' : `/structures/${cleanId(structureId)}`}
			/>

			<SaveButton action={save} disabled={disabledSave} />
		</ActionToolbar>
	);
};

export default Controls;
