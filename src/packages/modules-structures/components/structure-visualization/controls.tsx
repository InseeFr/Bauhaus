import { useNavigate } from 'react-router-dom';

import { ADMIN, STRUCTURE_CONTRIBUTOR } from '../../../auth/roles';
import { ActionToolbar } from '@components/action-toolbar';
import {
	DeleteButton,
	DuplicateButton,
	ReturnButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';
import { Structure } from '../../../model/structures/Structure';
import { UNPUBLISHED } from '../../../model/ValidationState';
import { usePermission } from '../../../redux/hooks/usePermission';
import { StructureApi } from '../../../sdk';
import { ValidationButton } from '@components/validationButton';

type ControlsTypes = {
	structure: Structure;
	publish: () => void;
};
const Controls = ({ structure, publish }: ControlsTypes) => {
	const permission = usePermission();
	const contributors = Array.isArray(structure.contributor)
		? structure.contributor
		: [structure.contributor];

	const { id } = structure;
	const navigate = useNavigate();

	const handleDelete = () => {
		StructureApi.deleteStructure(id).finally(() => {
			navigate('/structures');
		});
	};

	const hasRightsBasedOnStamp =
		contributors.find((contributor) => contributor === permission.stamp) &&
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
