import { useHistory } from 'react-router-dom';
import {
	ReturnButton,
	UpdateButton,
	DeleteButton,
	DuplicateButton,
} from '@inseefr/wilco';
import { UNPUBLISHED } from '../../../model/ValidationState';
import { ValidationButton } from '../../../components';
import { ADMIN, STRUCTURE_CONTRIBUTOR } from '../../../auth/roles';
import { StructureApi } from '../../../sdk';
import { usePermission } from '../../../redux/hooks/usePermission';
import { Structure } from '../../../model/structures/Structure';
import { ActionToolbar } from '../../../components/action-toolbar';

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
	const history = useHistory();

	const handleDelete = () => {
		StructureApi.deleteStructure(id).finally(() => {
			history.push('/structures');
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
