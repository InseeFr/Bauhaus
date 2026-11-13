import { useEffect, useEffectEvent } from "react";

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

  const renewPeriodically = useEffectEvent(() => {
    void renewTokens();
  });

  useEffect(() => {
    const intervalId = setInterval(renewPeriodically, 120000);
    return () => clearInterval(intervalId);
  }, []);

  return <WrappedComponent />;
};
