import { oidcSpa } from "oidc-spa/react-spa";

const { bootstrapOidc, useOidc, getOidc, OidcInitializationGate } = oidcSpa.createUtils();

export { useOidc, getOidc, OidcInitializationGate };

bootstrapOidc(
  !import.meta.env.VITE_OIDC_ISSUER
    ? {
        implementation: "mock",
        isUserInitiallyLoggedIn: false,
      }
    : {
        implementation: "real",
        issuerUri: import.meta.env.VITE_OIDC_ISSUER,
        clientId: import.meta.env.VITE_OIDC_CLIENT_ID,
        scopes: ["openid"],
      },
);
