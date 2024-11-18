import { Provider } from 'react-redux';
import Root from './packages/application/router';
import configureStore from './packages/redux/configure-store';
import D from './packages/deprecated-locales';
import { ApplicationTitle } from '@components/application-title';
import { AppContextProvider } from './packages/application/app-context';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import loadDevTools from './dev-tools/load';
import './packages/styles/main.scss';
import { GeneralApi } from '@sdk/general-api';
import { getLang } from './packages/utils/dictionnary';
import BackToTop from './packages/components/back-to-top';
import { OidcProvider } from './packages/auth/create-oidc';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
		},
	},
});

const ErrorBlock = () => {
	return (
		<div>
			<div className="container">
				<h1 className="text-center">{D.errorTitle}</h1>
				<p className="text-center">{D.errorBody}</p>
			</div>
		</div>
	);
};

GeneralApi.getInit()
	.then(
		(res: any) => (res.ok ? res.json() : Promise.reject(res.statusText)),
		(err: any) => {
			renderApp(ErrorBlock, {}, { home: true });
			return Promise.reject(err.toString());
		},
	)
	.then((res: any) => renderApp(Root, res));

const renderApp = (
	Component: () => JSX.Element,
	initState: Record<string, string>,
	props?: { home: true },
) => {
	const { authType: type, lg1, lg2, version, ...properties } = initState;
	const store = configureStore({
		app: {
			auth: { type, user: { roles: [], stamp: '' } },
		},
	});

	loadDevTools(store, () => {
		document.querySelector('html')!.setAttribute('lang', getLang());

		const container = document.getElementById('root');
		const root = createRoot(container!);

		root.render(
			<OidcProvider fallback={<>Checking authentication ⌛️</>}>
				<QueryClientProvider client={queryClient}>
					<Provider store={store}>
						<AppContextProvider
							lg1={lg1}
							lg2={lg2}
							version={version}
							properties={properties}
						>
							<ApplicationTitle />
							<main>
								<Component {...props} />
								<BackToTop />
							</main>
						</AppContextProvider>
					</Provider>
				</QueryClientProvider>
			</OidcProvider>,
		);
	});
};
