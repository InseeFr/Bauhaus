export const getEnvVar = (key: string) =>
	(window as any)?._env_?.[key] || process.env[`REACT_APP_${key}`];
