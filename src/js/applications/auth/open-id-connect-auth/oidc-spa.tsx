import React from 'react';
import { connect } from 'react-redux';
import { saveUserProps } from '../../../store/users';
import { useOidc } from '../../../new-architecture/auth/createReactOidc';
import { Auth } from '../../../utils';

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
			extraQueryParams: { scope: 'openid timbre' },
		});

		return null;
	}

	const roles = (oidcTokens?.decodedIdToken.realm_access as any).roles;
	const stamp = oidcTokens?.decodedIdToken.timbre as string;

	Auth.setToken(oidcTokens?.accessToken);
	saveUserProps({ roles, stamp });

	return <WrappedComponent />;
};

const mapDispatchToProps = {
	saveUserProps,
};

export default connect(undefined, mapDispatchToProps)(LoginOidcComponent);
