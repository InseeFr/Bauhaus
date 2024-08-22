import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import {
	ActionToolbar,
	ReturnButton,
	UpdateButton,
	DeleteButton,
	DuplicateButton,
} from '@inseefr/wilco';
import { useSelector } from 'react-redux';
import { UNPUBLISHED } from '../../../model/ValidationState';
import { ValidationButton } from '../../../components';
import { ADMIN, STRUCTURE_CONTRIBUTOR } from '../../../auth/roles';
import { getPermission } from '../../../redux/selectors';
import { StructureApi } from '../../../sdk';
const Controls = ({ structure, publish }) => {
	const permission = useSelector(getPermission);

	const { id } = structure;
	let history = useHistory();

	const handleDelete = useCallback(() => {
		StructureApi.deleteStructure(id).finally(() => {
			history.push('/structures');
		});
	}, [id, history]);

	const hasRightsBasedOnStamp =
		permission?.stamp === structure?.contributor &&
		permission?.roles?.includes(STRUCTURE_CONTRIBUTOR);
	const isAdmin = permission?.roles?.includes(ADMIN);
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
					structure.validationState === UNPUBLISHED)) && (
				<DeleteButton action={handleDelete} />
			)}
			{(isAdmin || hasRightsBasedOnStamp) && (
				<UpdateButton action={`/structures/${id}/update`} />
			)}
		</ActionToolbar>
	);
};

export default Controls;
