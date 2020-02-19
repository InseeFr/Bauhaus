import React from 'react';
import api from 'js/remote-api/api';
import { Habilitation as HabilitationContainer } from '@inseefr/iam';
import { Menu, PageTitle, goBack } from '@inseefr/wilco';
import D from 'js/i18n';
const Habilitation = props => {
	document.getElementById('root-app').classList = ['bauhaus-app'];
	return (
		<>
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
			/>
		</>
	);
};
export default Habilitation;
