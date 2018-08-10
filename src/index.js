import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Root from 'js/components/router';
import Error from 'js/components/shared/error';
import configureStore from 'js/store/configure-store';
import Api from 'js/remote-api/api';
import loadCodesList from 'js/actions/operations/series/codesList';
import { CL_SOURCE_CATEGORY, CL_FREQ } from 'js/actions/constants/codeList';

import 'app.css';

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

	loadCodesList([CL_SOURCE_CATEGORY, CL_FREQ], store);

	ReactDOM.render(
		<Provider store={store}>
			<Component {...props} />
		</Provider>,
		document.getElementById('root')
	);
};
