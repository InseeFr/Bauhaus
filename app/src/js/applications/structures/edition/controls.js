import React from 'react';
import { useParams } from 'react-router-dom';
import {
	cleanId,
	ReturnButton,
	ActionToolbar,
	SaveButton,
} from '@inseefr/wilco';

const Controls = ({ creation, save, disabledSave }) => {
	const { dsdId } = useParams();
	return (
		<ActionToolbar>
			<ReturnButton
				action={creation ? '/structures' : `/structures/${cleanId(dsdId)}`}
			/>

			<SaveButton action={save} disabled={disabledSave} />
		</ActionToolbar>
	);
};

export default Controls;
