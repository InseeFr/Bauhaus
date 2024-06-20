import { Auth } from 'js/utils';
import D from '../../i18n/build-dictionary';
import React from 'react';
import { useSelector } from 'react-redux';

export const CodesPanelAddButton = ({ codelist, onHandlePanel }) => {
	const permission = useSelector(Auth.getPermission);

	if (!codelist.lastCodeUriSegment) {
		return null;
	}
	const hasRightsBasedOnStamp =
		permission?.stamp === codelist?.contributor &&
		permission?.roles?.includes(Auth.CODELIST_CONTRIBUTOR);
	const isAdmin = permission?.roles?.includes(Auth.ADMIN);

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
