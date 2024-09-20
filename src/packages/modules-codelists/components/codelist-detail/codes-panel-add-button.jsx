import { ADMIN, CODELIST_CONTRIBUTOR } from '../../../auth/roles';
import { usePermission } from '../../../redux/hooks/usePermission';
import { AddButton } from '../../../components/buttons/add';

export const CodesPanelAddButton = ({ codelist, onHandlePanel }) => {
	const permission = usePermission();

	if (!codelist.lastCodeUriSegment) {
		return null;
	}
	const hasRightsBasedOnStamp =
		permission?.stamp === codelist?.contributor &&
		permission?.roles?.includes(CODELIST_CONTRIBUTOR);
	const isAdmin = permission?.roles?.includes(ADMIN);

	return (
		(isAdmin || hasRightsBasedOnStamp) && (
			<AddButton id="add-code" onClick={onHandlePanel} />
		)
	);
};
