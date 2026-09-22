import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { useTranslation } from "react-i18next";

import { ApplicationTitle } from "@components/application-title";
import { BackToTop } from "@components/back-to-top";

import { GeneralApi } from "@sdk/general-api";

import { getLang } from "@utils/dictionary";

import { AppContextProvider, type AppProperties } from "./packages/application/app-context";
import { Root } from "./packages/application/router";
import { createAppRouter } from "./packages/application/router/routes";
import { OidcProvider } from "./packages/auth/create-oidc";
import { appI18n } from "./packages/i18n";
import "./packages/styles/main.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const ErrorBlock = () => {
  const { t } = useTranslation("translation", { i18n: appI18n });

  return (
    <div>
      <div className="container">
        <h1 className="text-center">{t("home.errorTitle")}</h1>
        <p className="text-center">{t("home.errorBody")}</p>
      </div>
    </div>
  );
};

// `getInit` rejette déjà sur un statut HTTP en erreur ; le parsing est dans la
// chaîne pour qu'un corps non JSON (page HTML d'un proxy) mène aussi à la page d'erreur.
GeneralApi.getInit()
  .then((res: Response) => res.json())
  .then(
    (res: any) => renderApp(<Root router={createAppRouter(res.modules)} />, res),
    () => renderApp(<ErrorBlock />, {}),
  );

/**
 * Données renvoyées par `GeneralApi.getInit()`. Sur le chemin d'erreur, l'API
 * n'a rien renvoyé : on rend la page d'erreur avec un état vide, d'où le
 * `Partial` et la conversion explicite plus bas — la page d'erreur ne lit
 * aucune de ces propriétés.
 */
type InitState = {
  authType: string;
  lg1: string;
  lg2: string;
  version: string;
} & AppProperties;

const renderApp = (page: ReactNode, initState: Partial<InitState>) => {
  const { authType, lg1, lg2, version, ...properties } = initState;

  document.querySelector("html")!.setAttribute("lang", getLang());

  const container = document.getElementById("root");
  const root = createRoot(container!);

  root.render(
    <OidcProvider fallback="Checking authentication ⌛️">
      <QueryClientProvider client={queryClient}>
        <AppContextProvider
          lg1={lg1 ?? ""}
          lg2={lg2 ?? ""}
          version={version}
          properties={properties as AppProperties}
          authType={authType}
        >
          <ApplicationTitle />
          <main>
            {page}
            <BackToTop />
          </main>
        </AppContextProvider>
      </QueryClientProvider>
    </OidcProvider>,
  );
};
