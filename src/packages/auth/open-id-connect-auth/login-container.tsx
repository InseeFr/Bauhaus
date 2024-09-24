import { useEffect, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import Keycloak from 'keycloak';
import { Loading } from '../../components';
import { saveUserProps } from '../../redux/users';
import {
	getAuthPropsFromToken,
	getToken,
	isTokenValid,
	storeToken,
} from './token-utils';
import { getPermission } from '../../redux/selectors';
import { useLocation, useNavigate } from 'react-router-dom';

const kcConfig = `${window.location.origin}/keycloak.json`;

const kc = Keycloak(kcConfig);

type LoginOpenIDConnectTypes = {
	saveUserProps: (props: any) => void;
	authenticated: string;
	WrappedComponent: any;
};
const LoginOpenIDConnect = ({
	saveUserProps,
	authenticated,
	WrappedComponent,
}: LoginOpenIDConnectTypes) => {
	const [token, setToken] = useState(getToken());
	const navigate = useNavigate();
	const location = useLocation();

	const initLogin = useCallback(() => {
		const refreshToken = () => {
			kc.updateToken(30)
				.success((isUpdated: boolean) => {
					if (isUpdated) {
						kc.token && storeToken(kc.token);
						saveUserProps(getAuthPropsFromToken(kc.tokenParsed));
					}
				})
				.error(() => initLogin());
		};

		const redirectUri = window.location.href.replace(
			window.location.search,
			''
		);
		kc.redirectUri = redirectUri;
		kc.init({
			onLoad: 'login-required',
			responseMode: 'query',
			checkLoginIframe: false,
		})
			.success(() => {
				saveUserProps(getAuthPropsFromToken(kc.tokenParsed));
				if (kc.token) {
					storeToken(kc.token);
					setToken(kc.token);
				}
				setInterval(() => refreshToken(), 20000);
				navigate(location.pathname, { state: 'init' });
			})
			.error((e: any) => console.log('erreur initLogin', e));
	}, [history, saveUserProps]);

	useEffect(() => {
		initLogin();
	}, [initLogin]);

	if (authenticated && token && isTokenValid(token))
		return <WrappedComponent />;
	return <Loading textType="authentification" />;
};

export const mapStateToProps = (state: any) => ({
	authenticated: getPermission(state).stamp,
});

const mapDispatchToProps = {
	saveUserProps,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginOpenIDConnect);
