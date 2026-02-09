import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";

import { ApplicationTitle } from "@components/application-title";

import { GeneralApi } from "@sdk/general-api";

import { AppContextProvider } from "./packages/application/app-context";
import Root from "./packages/application/router";
import { OidcProvider } from "./packages/auth/create-oidc";
import BackToTop from "./packages/components/back-to-top";
import D from "./packages/deprecated-locales";
import "./packages/styles/main.scss";
import { getLang } from "./packages/utils/dictionnary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const ErrorBlock = () => {
  return (
    <div>
      <div className="container">
        <h1 className="text-center">{D.errorTitle}</h1>
        <p className="text-center">{D.errorBody}</p>
      </div>
    </div>
  );
};

GeneralApi.getInit()
  .then(
    (res: any) => (res.ok ? res.json() : Promise.reject(res.statusText)),
    (err: any) => {
      renderApp(ErrorBlock, {}, { home: true });
      return Promise.reject(err.toString());
    },
  )
  .then((res: any) => renderApp(Root, res));

const renderApp = (
  Component: () => JSX.Element,
  initState: Record<string, string>,
  props?: { home: true },
) => {
  const { authType, lg1, lg2, version, ...properties } = initState;

  document.querySelector("html")!.setAttribute("lang", getLang());

  const container = document.getElementById("root");
  const root = createRoot(container!);

  root.render(
    <OidcProvider fallback={<>Checking authentication ⌛️</>}>
      <QueryClientProvider client={queryClient}>
        <AppContextProvider
          lg1={lg1}
          lg2={lg2}
          version={version}
          properties={properties}
          authType={authType}
        >
          <ApplicationTitle />
          <main>
            <Component {...props} />
            <BackToTop />
          </main>
        </AppContextProvider>
      </QueryClientProvider>
    </OidcProvider>,
  );
};
