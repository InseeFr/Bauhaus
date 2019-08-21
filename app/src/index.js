import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Root from 'js/components/router';
import Error from 'js/components/shared/error/error';
import configureStore from 'js/store/configure-store';
import Api from 'js/remote-api/api';
import { I18NContext, BackToTop } from 'bauhaus-library';
import { bauhausLibraryDictionary } from 'js/i18n';

import 'app.scss';
import 'bauhaus-library/dist/index.css';

Api.getInit()
	.then(
		res => (res.ok ? res.json() : Promise.reject(res.statusText)),
		err => {
			renderApp(Error, {}, { home: true });
			return Promise.reject(err.toString());
		}
	)
	.then(res => renderApp(Root, res));

const renderApp = (Component, initState, props) => {
	const { authType: type, ...properties } = initState;
	const store = configureStore({
		app: {
			auth: { type, user: { roles: [], stamp: '' } },
			properties,
			secondLang: false,
			error: false,
		},
	});

	ReactDOM.render(
		<Provider store={store}>
			<I18NContext.Provider value={bauhausLibraryDictionary}>
				<main>
					<Component {...props} />
					<BackToTop />
				</main>
			</I18NContext.Provider>
		</Provider>,
		document.getElementById('root')
	);
};
