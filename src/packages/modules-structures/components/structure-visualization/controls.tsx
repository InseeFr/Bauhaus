import { useNavigate } from 'react-router-dom';

import { ActionToolbar } from '@components/action-toolbar';
import {
	DeleteButton,
	DuplicateButton,
	ReturnButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';
import { ValidationButton } from '@components/validationButton';

import { StructureApi } from '@sdk/index';

import { HasAccess } from '../../../auth/components/auth';
import { UNPUBLISHED } from '../../../model/ValidationState';
import { Structure } from '../../../model/structures/Structure';

interface ControlsTypes {
	structure: Structure;
	publish: VoidFunction;
}
const Controls = ({ structure, publish }: ControlsTypes) => {
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

	return (
		<ActionToolbar>
			<ReturnButton action="/structures" />
			<HasAccess
				module="STRUCTURE_STRUCTURE"
				privilege="PUBLISH"
				stamps={contributors}
			>
				<ValidationButton object={structure} callback={publish} />
			</HasAccess>

			<HasAccess
				module="STRUCTURE_STRUCTURE"
				privilege="CREATE"
				stamps={contributors}
			>
				<DuplicateButton action={`/structures/${id}/duplicate`} />
			</HasAccess>

			<HasAccess
				module="STRUCTURE_STRUCTURE"
				privilege="DELETE"
				complementaryCheck={structure.validationState === UNPUBLISHED}
				stamps={contributors}
			>
				<DeleteButton action={handleDelete} />
			</HasAccess>

			<HasAccess
				module="STRUCTURE_STRUCTURE"
				privilege="UPDATE"
				complementaryCheck={structure.validationState === UNPUBLISHED}
				stamps={contributors}
			>
				<UpdateButton action={`/structures/${id}/update`} />
			</HasAccess>
		</ActionToolbar>
	);
};

export default Controls;
