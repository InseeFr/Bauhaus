import D from '../../i18n/build-dictionary';
import { useSelector } from 'react-redux';
import { ADMIN, CODELIST_CONTRIBUTOR } from '../../../auth/roles';
import { getPermission } from '../../../redux/selectors';

export const CodesPanelAddButton = ({ codelist, onHandlePanel }) => {
	const permission = useSelector(getPermission);

	if (!codelist.lastCodeUriSegment) {
		return null;
	}
	const hasRightsBasedOnStamp =
		permission?.stamp === codelist?.contributor &&
		permission?.roles?.includes(CODELIST_CONTRIBUTOR);
	const isAdmin = permission?.roles?.includes(ADMIN);

	return (
		(isAdmin || hasRightsBasedOnStamp) && (
			<button
				id="add-code"
				type="button"
				aria-label={D.addCodeTitle}
				onClick={onHandlePanel}
			>
				<span className="glyphicon glyphicon-plus"></span>
			</button>
		)
	);
};
