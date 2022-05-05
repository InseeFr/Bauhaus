import React from 'react';
import { Loading } from '@inseefr/wilco';
import { OidcProvider, useOidcIdToken, useOidcUser } from '@axa-fr/react-oidc-context';

const configuration = {
	client_id: 'interactive.public.short',
	redirect_uri: 'http://localhost:3000',
	scope: 'openid email inseeRoleApplicatif inseeTimbre profile',
	authority: 'https://auth.insee.test/auth',
	//service_worker_relative_url:'/OidcServiceWorker.js',
	service_worker_only:false,
};

const LoginOpenIDConnect = ({ WrappedComponent }) => {
	const{ idToken, idTokenPayload } = useOidcIdToken();

	if(!idToken){
		return <Loading textType="authentification" />;
	}

	console.log({ idToken, idTokenPayload })
	return (
		<OidcProvider configuration={configuration}>
			<WrappedComponent />
		</OidcProvider>
	)
};

export default LoginOpenIDConnect
/*

const kc = Keycloak(kcConfig);
const LoginOpenIDConnect = ({ saveUserProps, authenticated, WrappedComponent }) => {
	const [token, setToken] = useState(Auth.getToken())
	const history = useHistory()
	const refreshToken = useCallback(() => {
		kc
			.updateToken(30)
			.success(isUpdated => {
				if (isUpdated) {
					kc.token && Auth.setToken(kc.token);
					saveUserProps(
						Auth.getAuthPropsFromToken(kc.tokenParsed)
					);
				}
			})
			.error(error => this.initLogin());
	}, [saveUserProps])


	const initLogin = useCallback(() => {
		const redirectUri = window.location.href.replace(
			window.location.search,
			''
		);
		kc.redirectUri = redirectUri;
		kc
			.init({
				onLoad: 'login-required',
				responseMode: 'query',
				checkLoginIframe: false,
			})
			.success(() => {
				saveUserProps(
					Auth.getAuthPropsFromToken(kc.tokenParsed)
				);
				if(kc.token) {
					Auth.setToken(kc.token);
					setToken(kc.token)
				}
				setInterval(() => refreshToken(), 20000);
				history.push({ pathname: history.location.pathname, state: 'init' });
			})
			.error(e => console.log('erreur initLogin', e));
	}, [history, refreshToken, saveUserProps]);

	useEffect(() => {
		initLogin();
	}, [initLogin])

	if (authenticated && token && Auth.isTokenValid(token))
		return <WrappedComponent />;
	return <Loading textType="authentification" />;
}

export const mapStateToProps = state => ({
	authenticated: Auth.getPermission(state).stamp,
});

const mapDispatchToProps = {
	saveUserProps,
};

export default
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(LoginOpenIDConnect)

*/
