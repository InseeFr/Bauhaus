import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

import { useOidc } from "../../auth/create-oidc";
import { appI18n } from "../../i18n";
import { useAppContext } from "../app-context";
import { Routes } from "./routes";

export const RBACLink = ({ children }: PropsWithChildren<unknown>) => {
  const { t } = useTranslation("translation", { i18n: appI18n });

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
      <footer className="text-center">
        <button type="button" onClick={logoutAndRemoveFromStorage} className="btn btn-primary">
          {t("auth.logout")}
        </button>
        <div>
          <div id="bauhausVersion">
            <p className="text-left">{footer}</p>
          </div>
          <div className="footer-logos">
            <a href="https://www.insee.fr">
              <img src="/img/insee_logo_bas_de_page-01.svg" alt="logo insee" />
            </a>
            <a href="https://www.casd.eu/">
              <img src="/img/casd_logo_bas_de_page-01.svg" alt="logo CASD" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export const Root = () => {
  return <Routes />;
};
