import { useSelector } from 'react-redux';
import { Auth } from 'bauhaus-utilities';
import React from 'react';
import {
	ActionToolbar,
	ReturnButton,
	SaveButton,
	UpdateButton,
} from '@inseefr/wilco';
export const CodeSlidingPanelMenu = ({
	codelist,
	handleSubmit,
	handleBack,
	creation,
}) => {
	const permission = useSelector(Auth.getPermission);

	const hasRightsBasedOnStamp =
		permission?.stamp === codelist?.contributor &&
		permission?.roles?.includes(Auth.CODELIST_CONTRIBUTOR);
	const isAdmin = permission?.roles?.includes(Auth.ADMIN);

	return (
		<ActionToolbar>
			<ReturnButton action={handleBack} col={6} />
			{(isAdmin || hasRightsBasedOnStamp) && (
				<>
					{!creation && <UpdateButton action={handleSubmit} col={6} />}
					{creation && <SaveButton action={handleSubmit} col={6} />}
				</>
			)}
		</ActionToolbar>
	);
};
