import React  from 'react';
import PropTypes from 'prop-types';
import { Button, ActionToolbar } from '@inseefr/wilco';
import D from 'js/i18n';
import { Auth, useRedirectWithDefault } from 'bauhaus-utilities';

const ItemControls = ({ classificationId, itemId, version }) =>  {
	const goBack = useRedirectWithDefault(`/classifications/classification/${classificationId}/items`);

	const cancel = [
		goBack,
		D.btnReturn,
	];
	const compare =
		!version || version <= 1
			? null
			: [
					`/classifications/classification/${classificationId}/item/${itemId}/compare`,
					D.btnCompare,
				];
	const btns = [cancel, compare];

	return (
		<ActionToolbar>
			{btns.map((btn) => {
				if (!btn) return null;
				const [action, label] = btn;
				return btn && <Button key={label} action={action} label={label} />;
			})}
			<Auth.AuthGuard roles={[Auth.ADMIN]}>
				<Button
					action={`/classifications/classification/${classificationId}/item/${itemId}/modify`}
					label={D.btnUpdate}
				/>
			</Auth.AuthGuard>
		</ActionToolbar>
	);
}

ItemControls.propTypes = {
	classificationId: PropTypes.string.isRequired,
	itemId: PropTypes.string.isRequired,
	version: PropTypes.string,
};

export default ItemControls;
