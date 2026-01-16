import { useEffect, useState } from "react";

import { useOidc } from "../create-oidc";

interface OidcWrapperTypes {
  WrappedComponent: any;
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

export const LoggedInWrapper = ({ WrappedComponent }: OidcWrapperTypes) => {
  const { oidcTokens, renewTokens } = useOidc({
    assertUserLoggedIn: true,
  });
  const [userInformationLoaded, setUserInformationLoaded] = useState(false);

  const syncUserInformation = () => {
    console.debug("Fetching User Informations...");
    console.debug({ oidcTokens });
    setUserInformationLoaded(true);
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

export default LoggedInWrapper;
