---
title: How to Build
---

## Build for production

```shell
pnpm build
```

Outputs a production-ready bundle into the `dist/` folder. For INSEE deployments, the CI uses this command, which also produces a `.zip` archive for deployment.

Serve the output with any static HTTP server of your choice.

## Build a Docker image

```shell
docker build . -t bauhaus-front
```

## Run the Docker image

```shell
docker run -it -p 8083:80 -e VITE_API_BASE_HOST=http://192.168.1.12:8081/api bauhaus-front
```

Replace `http://192.168.1.12:8081/api` with the base URL of your Bauhaus Back-Office API.
