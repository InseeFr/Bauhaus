import { NO_AUTH, OPEN_ID_CONNECT_AUTH } from "./constants";
import { useOidc } from "./create-oidc";
import LoggedInWrapper, { LoginComponent } from "./open-id-connect-auth/use-oidc";
import { useAppContext } from "../application/app-context";

export const withAuth = (WrappedComponent: () => JSX.Element) => {
  const AuthComponent = () => {
    const { authType } = useAppContext();
    const { isUserLoggedIn } = useOidc();
    if (authType === OPEN_ID_CONNECT_AUTH) {
      if (!isUserLoggedIn) return <LoginComponent />;
      else return <LoggedInWrapper WrappedComponent={WrappedComponent} />;
    }

    if (authType === NO_AUTH) {
      return <WrappedComponent />;
    }

    return (
      <div role="alert" aria-live="polite">
        Erreur d'authentification
      </div>
    );
  };

  return AuthComponent;
};
