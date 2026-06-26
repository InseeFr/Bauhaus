import { PropsWithChildren } from "react";
import "react-app-polyfill/stable";

import { useOidc } from "../../auth/create-oidc";
import D from "../../i18n";
import { useAppContext } from "../app-context";
import Routes from "./routes";

export const RBACLink = ({ children }: PropsWithChildren<unknown>) => {
  const { isUserLoggedIn, logout } = useOidc();

  const logoutAndRemoveFromStorage = () => {
    if (isUserLoggedIn) {
      logout({
        redirectTo: "specific url",
        url: "/logout",
      });
    }
  };

  const { version } = useAppContext();
  const footer = `${import.meta.env.VITE_NAME} - IHM ${import.meta.env.VITE_VERSION} - API ${version}`;

  return (
    <>
      <div id="root-app">{children}</div>

      <footer className="text-center" style={{ marginTop: "50px" }}>
        <button type="button" onClick={logoutAndRemoveFromStorage} className="btn btn-primary">
          {D.authentication.logout}
        </button>
        <div>
          <div id="bauhausVersion">
            <p class="text-left">
            {/* 
            
background-color: #F2F2F2;
display: grid;
grid-template-columns: repeat(3, 1fr);
align-items: center;
            
padding-left: 30px;

            */}
            {footer}          
            </p>
          </div>
          <div>
          <a href="https://www.insee.fr">
            <img  src="/img/insee_logo_bas_de_page-01.svg" alt="logo insee" />
          </a>
          <a href="https://www.casd.eu/">
            <img  src="/img/casd_logo_bas_de_page-01.svg" alt="logo CASD" />
          </a>          
          </div>
          <div/>         
        </div>       
      </footer>
    </>
  );
};
const Root = () => {
  return <Routes />;
};

export default Root;
