import { connect } from 'react-redux';
import { saveUserProps } from '../../redux/users';
import { useOidc } from '../create-oidc';
import { storeToken } from './token-utils';
import { useEffect, useState } from 'react';
import { UsersApi } from '../../sdk/users-api';

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
	const [userInformationsLoaded, setUserInformationsLoaded] = useState(false);

	useEffect(() => {
		if (isUserLoggedIn) {
			storeToken(oidcTokens?.accessToken);
			UsersApi.getStamp().then((stamp: any) => {
				const roles = (oidcTokens?.decodedIdToken.realm_access as any).roles;
				saveUserProps({ roles, stamp });
				setUserInformationsLoaded(true);
			});
		}
	}, []);

	if (!isUserLoggedIn) {
		login({
			doesCurrentHrefRequiresAuth: true,
		});
		return null;
	}

	if (!userInformationsLoaded) {
		return null;
	}

	return <WrappedComponent />;
};

const mapDispatchToProps = {
	saveUserProps,
};

export default connect(undefined, mapDispatchToProps)(LoginOidcComponent);
