const LOCAL_HOSTNAMES = ["localhost", "127.0.0.1", "[::1]"];

/**
 * Vrai quand le front est servi depuis un poste de développement.
 *
 * On se base sur le hostname plutôt que sur `import.meta.env.DEV` : la même image
 * Docker sert tous les environnements (les VITE_* sont injectées au runtime par
 * vite-envs), donc un flag de build ne distingue pas localhost du reste.
 */
export const isLocalhost = () => LOCAL_HOSTNAMES.includes(window.location.hostname);
