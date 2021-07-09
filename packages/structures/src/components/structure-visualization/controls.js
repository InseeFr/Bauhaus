import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import {
	ActionToolbar,
	ReturnButton,
	ExportButton,
	UpdateButton,
	DeleteButton,
	DuplicateButton,
} from '@inseefr/wilco';
import { ValidationButton } from 'bauhaus-utilities';
import StructureAPI from '../../apis/structure-api';

const Controls = ({ structure, publish }) => {
	const { id } = structure;
	let history = useHistory();
	const isLocal = process.env.REACT_APP_MODE === 'local';

	const handleDelete = useCallback(() => {
		StructureAPI.deleteStructure(id).finally(() => {
			history.push('/structures');
		});
	}, [id, history]);
	return (
		<ActionToolbar>
			<ReturnButton action="/structures" />
			{isLocal && <ExportButton action={console.log} />}
			<ValidationButton object={structure} callback={publish} />
			<DuplicateButton action={`/structures/${id}/duplicate`} />
			<DeleteButton action={handleDelete} />
			<UpdateButton action={`/structures/${id}/update`} />
		</ActionToolbar>
	);
};

export default Controls;
