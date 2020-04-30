import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
	ActionToolbar,
	ReturnButton,
	ExportButton,
	UpdateButton,
	DeleteButton,
	DuplicateButton,
} from '@inseefr/wilco';
import StructureAPI from '../../apis/structure-api';

const Controls = () => {
	const { dsdId } = useParams();
	let history = useHistory();
	const isLocal = process.env.REACT_APP_API === 'local';

	const handleDelete = useCallback(() => {
		StructureAPI.deleteStructure(dsdId).then(() => {
			history.push('/structures');
		});
	}, [dsdId, history]);
	return (
		<ActionToolbar>
			<ReturnButton action="/structures" />
			{isLocal && <ExportButton action={console.log} />}
			<DuplicateButton action={`/structures/${dsdId}/duplicate`} />
			<DeleteButton action={handleDelete} />
			<UpdateButton action={`/structures/${dsdId}/update`} />
		</ActionToolbar>
	);
};

export default Controls;
