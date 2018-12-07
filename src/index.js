import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Root from 'js/components/router';
import Error from 'js/components/shared/error';
import configureStore from 'js/store/configure-store';
import Api from 'js/remote-api/api';
import BackToTop from 'js/components/shared/back-to-top/';

import 'app.scss';

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
			<main>
				<Component {...props} />
				<BackToTop />
			</main>
		</Provider>,
		document.getElementById('root')
	);
};
