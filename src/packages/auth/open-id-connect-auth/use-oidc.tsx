import { useEffect, useEffectEvent, useState } from "react";

import { useOidc } from "../create-oidc";

interface OidcWrapperTypes {
  WrappedComponent: any;
}

export const LoginComponent = () => {
  const { login } = useOidc();

  if (login) {
    login({
      doesCurrentHrefRequiresAuth: true,
    });
  }

  return null;
};

export const LoggedInWrapper = ({ WrappedComponent }: OidcWrapperTypes) => {
  const { renewTokens } = useOidc({ assert: "user logged in" });

  const [userInformationLoaded, setUserInformationLoaded] = useState(false);

  const syncUserInformation = useEffectEvent(() => {
    console.debug("Fetching User Informations...");
    setUserInformationLoaded(true);
  });

  const renewPeriodically = useEffectEvent(() => {
    renewTokens().then(syncUserInformation);
  });

  useEffect(() => {
    syncUserInformation();
    const intervalId = setInterval(renewPeriodically, 120000);
    return () => clearInterval(intervalId);
  }, []);

  if (!userInformationLoaded) {
    return null;
  }

  return <WrappedComponent />;
};
