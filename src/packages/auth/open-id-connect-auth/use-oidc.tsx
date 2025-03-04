import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { UsersApi } from '@sdk/users-api';

import { saveUserProps } from '../../redux/users';
import { useOidc } from '../create-oidc';

interface OidcWrapperTypes {
	WrappedComponent: any;
	saveUserProps: ({ roles, stamp }: { roles: string[]; stamp: string }) => void;
}

export const LoginComponent = () => {
	const { login } = useOidc({
		assertUserLoggedIn: false,
	});

	if (login) {
		login({
			doesCurrentHrefRequiresAuth: true,
		});
	}

	return null;
};

const LoggedInWrapper = ({
	WrappedComponent,
	saveUserProps,
}: OidcWrapperTypes) => {
	const { oidcTokens, renewTokens } = useOidc({
		assertUserLoggedIn: true,
	});
	const [userInformationLoaded, setUserInformationLoaded] = useState(false);

	const syncUserInformation = () => {
		console.debug('Fetching User Informations...');
		UsersApi.getStamp().then(({ stamp }: { stamp: string }) => {
			const roles = (oidcTokens?.decodedIdToken.realm_access as any).roles;
			saveUserProps({ roles, stamp });
			setUserInformationLoaded(true);
		});
	};
	useEffect(() => {
		syncUserInformation();
		setInterval(() => {
			renewTokens().then(syncUserInformation);
		}, 120000);
	}, []);

	if (!userInformationLoaded) {
		return null;
	}

	return <WrappedComponent />;
};

const mapDispatchToProps = {
	saveUserProps,
};

export default connect(undefined, mapDispatchToProps)(LoggedInWrapper);
