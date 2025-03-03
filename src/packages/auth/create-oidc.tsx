import { createMockReactOidc } from 'oidc-spa/mock/react';
import { createReactOidc } from 'oidc-spa/react';

export const { OidcProvider, useOidc, getOidc } = !import.meta.env
	.VITE_OIDC_ISSUER
	? createMockReactOidc({
			isUserInitiallyLoggedIn: false,
		})
	: createReactOidc({
			issuerUri: import.meta.env.VITE_OIDC_ISSUER,
			clientId: import.meta.env.VITE_OIDC_CLIENT_ID,
			publicUrl: import.meta.env.BASE_URL,
			scopes: ['openid'],
		});
