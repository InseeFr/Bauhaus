import { createReactOidc } from 'oidc-spa/react';

export const { OidcProvider, useOidc } = createReactOidc({
	issuerUri: 'https://auth.your-domain.net/realms/myrealm',
	clientId: 'myclient',
	/**
	 * Vite:  `publicUrl: import.meta.env.BASE_URL`
	 * CRA:   `publicUrl: process.env.PUBLIC_URL`
	 * Other: `publicUrl: "/"` (Usually)
	 */
	publicUrl: process.env.PUBLIC_URL,
});
