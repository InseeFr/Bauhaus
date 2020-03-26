import React from 'react';
import { Habilitation as HabilitationContainer } from '@inseefr/iam';
import { Menu, PageTitle, goBack } from '@inseefr/wilco';
import check from 'js/utils/auth';
import api from 'js/remote-api/api';
import D from 'js/i18n';
import './component.scss';

const Habilitation = props => {
	document.getElementById('root-app').classList = ['bauhaus-app'];
	const {
		permission: { authType, roles },
	} = props;
	const authImpl = check(authType);
	return (
		<div className="bauhaus-habilitations">
			<Menu paths={[]}></Menu>
			<PageTitle title={D.authorizationTitle} />
			<HabilitationContainer
				loadAgentList={api.getAgentList}
				loadRoleList={api.getRoleList}
				deleteAgent={api.postDeleteRole}
				addAgent={api.postAddRole}
				handleBack={() => {
					goBack(props, '/')();
				}}
				displayUpdateBtn={authImpl.isAdmin(roles)}
			/>
		</div>
	);
};
export default Habilitation;
