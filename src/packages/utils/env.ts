export const getEnvVar = (key: string) =>
	(window as any)?._env_?.[key] || import.meta.env[`VITE_${key}`];
