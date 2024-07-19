import { createReactOidc } from 'oidc-spa/react';

export const { OidcProvider, useOidc } = createReactOidc({
	issuerUri: 'https://auth.insee.test/auth/realms/agents-insee-interne',
	clientId: 'localhost-frontend',
	/**
	 * Vite:  `publicUrl: import.meta.env.BASE_URL`
	 * CRA:   `publicUrl: process.env.PUBLIC_URL`
	 * Other: `publicUrl: "/"` (Usually)
	 */
	publicUrl: '/',
});
