import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import {
	ActionToolbar,
	ReturnButton,
	UpdateButton,
	DeleteButton,
	DuplicateButton,
} from '@inseefr/wilco';
import { Auth, ValidationButton } from 'bauhaus-utilities';
import StructureAPI from '../../apis/structure-api';

const Controls = ({ structure, publish }) => {
	const { id } = structure;
	let history = useHistory();

	const handleDelete = useCallback(() => {
		StructureAPI.deleteStructure(id).finally(() => {
			history.push('/structures');
		});
	}, [id, history]);
	return (
		<ActionToolbar>
			<ReturnButton action="/structures" />
			<Auth.AuthGuard roles={[Auth.ADMIN]}><ValidationButton object={structure} callback={publish} /></Auth.AuthGuard>
			<Auth.AuthGuard roles={[Auth.ADMIN]}><DuplicateButton action={`/structures/${id}/duplicate`} /></Auth.AuthGuard>
			<Auth.AuthGuard roles={[Auth.ADMIN]}><DeleteButton action={handleDelete} /></Auth.AuthGuard>
			<Auth.AuthGuard roles={[Auth.ADMIN]}><UpdateButton action={`/structures/${id}/update`} /></Auth.AuthGuard>
		</ActionToolbar>
	);
};

export default Controls;
