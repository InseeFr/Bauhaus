import { Provider } from 'react-redux';
import Root from 'js/router';
import configureStore from 'js/store/configure-store';
import Api from 'js/remote-api/api';
import { I18NContext, BackToTop, getLang } from '@inseefr/wilco';
import D from 'js/i18n';
import ApplicationTitle from 'js/applications/shared/application-title';
import { AppContext } from 'bauhaus-utilities';
import '@inseefr/wilco/dist/index.css';
import 'bauhaus-operations/dist/index.css';
import 'bauhaus-structures/dist/index.css';
import 'bauhaus-utilities/dist/index.css';
import 'bauhaus-codelists/dist/index.css';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import loadDevTools from './dev-tools/load';
import * as Sentry from '@sentry/react';

import 'main.scss';
import { apiURL } from 'bauhaus-utilities/src/apis/build-api';

Sentry.init({
	dsn: 'https://57eb7cf936ad4c9198267ec7cd0031aa@o364590.ingest.sentry.io/4505557438169088',
});

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
			refetchInterval: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
			refetchIntervalInBackground: false,
			cacheTime: Infinity,
		},
	},
});

const Error = () => {
	return (
		<div>
			<div className="container">
				<h1 className="text-center">{D.errorTitle}</h1>
				<p className="text-center">{D.errorBody}</p>
			</div>
		</div>
	);
};

const apiInit = Api.getInit().then((res) =>
	res.ok ? res.json() : Promise.reject(res.statusText)
);

const configuration = fetch(apiURL).then((res) =>
	res.ok ? res.json() : Promise.resolve({})
);

Promise.all([apiInit, configuration])
	.then(([apiInit, configuration]) =>
		renderApp(Root, { state: apiInit, configuration })
	)
	.catch((err) => {
		renderApp(Error, { state: {}, configuration: {} }, { home: true });
		return Promise.reject(err.toString());
	});

const renderApp = (Component, { state, configuration }, props) => {
	const { authType: type, lg1, lg2, ...properties } = state;

	const store = configureStore({
		app: {
			auth: { type, user: { roles: [], stamp: '' } },
			lg1,
			lg2,
			properties,
			secondLang: false,
			error: false,
			configuration,
		},
	});

	loadDevTools(store, configuration, () => {
		document.querySelector('html').setAttribute('lang', getLang());

		const container = document.getElementById('root');
		const root = createRoot(container);
		root.render(
			<QueryClientProvider client={queryClient}>
				<Provider store={store}>
					<AppContext.Provider value={{ lg1, lg2 }}>
						<I18NContext.Provider value={D}>
							<ApplicationTitle />
							<main>
								<Component {...props} />
								<BackToTop />
							</main>
						</I18NContext.Provider>
					</AppContext.Provider>
				</Provider>
			</QueryClientProvider>
		);
	});
};
