import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import {
	ActionToolbar,
	ReturnButton,
	UpdateButton,
	DeleteButton,
	DuplicateButton,
} from '@inseefr/wilco';
import { Auth, ValidationButton } from 'js/utils';
import StructureAPI from '../../apis/structure-api';
import { useSelector } from 'react-redux';

const Controls = ({ structure, publish }) => {
	const permission = useSelector(Auth.getPermission);

	const { id } = structure;
	let history = useHistory();

	const handleDelete = useCallback(() => {
		StructureAPI.deleteStructure(id).finally(() => {
			history.push('/structures');
		});
	}, [id, history]);

	const hasRightsBasedOnStamp =
		permission?.stamp === structure?.contributor &&
		permission?.roles?.includes(Auth.STRUCTURE_CONTRIBUTOR);
	const isAdmin = permission?.roles?.includes(Auth.ADMIN);
	return (
		<ActionToolbar>
			<ReturnButton action="/structures" />
			{(isAdmin || hasRightsBasedOnStamp) && (
				<ValidationButton object={structure} callback={publish} />
			)}
			{(isAdmin || hasRightsBasedOnStamp) && (
				<DuplicateButton action={`/structures/${id}/duplicate`} />
			)}
			{(isAdmin ||
				(hasRightsBasedOnStamp &&
					structure.validationState === 'Unpublished')) && (
				<DeleteButton action={handleDelete} />
			)}
			{(isAdmin || hasRightsBasedOnStamp) && (
				<UpdateButton action={`/structures/${id}/update`} />
			)}
		</ActionToolbar>
	);
};

export default Controls;
