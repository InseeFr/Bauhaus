import { createReactOidc } from 'oidc-spa/react';

export const { OidcProvider, useOidc, getOidc } = createReactOidc({
	issuerUri: 'https://auth.insee.test/auth/realms/agents-insee-interne',
	clientId: 'localhost-frontend',
	publicUrl: import.meta.env.BASE_URL,
});
