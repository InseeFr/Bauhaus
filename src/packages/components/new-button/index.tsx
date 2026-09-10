import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import { componentsI18n } from "../i18n";
import { AddLogo } from "../logo/logo-add";
import "./newButton.css";

interface AbstractNewButtonTypes {
  action: ((location: any) => any) | string;
  suffix?: string;
  component?: "button" | "link";
}

const AbstractNewButton = ({
  action,
  children,
  suffix,
  component = "link",
}: PropsWithChildren<AbstractNewButtonTypes>) => {
  if (component === "button") {
    return (
      <button
        type="button"
        className="new-button btn btn-lg col-md-12"
        onClick={action as () => void}
      >
        <AddLogo />
        {suffix ? (
          <span>
            {children} {suffix}
          </span>
        ) : (
          <span>{children}</span>
        )}
      </button>
    );
  }

  return (
    // `action` est une URL en mode lien, un gestionnaire en mode bouton (voir la branche ci-dessus).
    <NavLink className="new-button btn btn-lg col-md-12" to={action as string}>
      <AddLogo />
      {suffix ? (
        <span>
          {children} {suffix}
        </span>
      ) : (
        <span>{children}</span>
      )}
    </NavLink>
  );
};

export const MasculineButton = (props: AbstractNewButtonTypes) => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });

  return <AbstractNewButton {...props}>{t("btnNew.masculine")}</AbstractNewButton>;
};

export const FeminineButton = (props: AbstractNewButtonTypes) => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });

  return <AbstractNewButton {...props}>{t("btnNew.feminine")}</AbstractNewButton>;
};
