import { connect } from 'react-redux';
import { saveUserProps } from '../../redux/users';
import { useOidc } from '../create-oidc';
import { storeToken } from './token-utils';

type LoginOidcComponentTypes = {
	WrappedComponent: any;
	saveUserProps: ({ roles, stamp }: { roles: string[]; stamp: string }) => void;
};

const LoginOidcComponent = ({
	WrappedComponent,
	saveUserProps,
}: LoginOidcComponentTypes) => {
	const { isUserLoggedIn, login, oidcTokens } = useOidc({
		assertUserLoggedIn: false,
	});

	if (!isUserLoggedIn) {
		login({
			doesCurrentHrefRequiresAuth: true,
			// extraQueryParams: { scope: 'openid timbre' }, !!! nécessaire mais ne fonctionne pas avec : invalid_scope !!!
		});
		return null;
	}

	const roles = (oidcTokens?.decodedIdToken.realm_access as any).roles;
	const stamp = oidcTokens?.decodedIdToken.timbre as string;

	storeToken(oidcTokens?.accessToken);
	saveUserProps({ roles, stamp });

	return <WrappedComponent />;
};

const mapDispatchToProps = {
	saveUserProps,
};

export default connect(undefined, mapDispatchToProps)(LoginOidcComponent);
