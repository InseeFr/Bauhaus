import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Root from 'js/components/Root';
import configureStore from 'js/store/configure-store';
import Api from 'js/remote-api/api';
import './css/index.css';

Api.getAuthType()
	.then(
		res => {
			if (res.ok) {
				return res.text();
			} else return Promise.reject(res.statusText);
		},
		err => Promise.reject(err.toString())
	)
	.then(res => {
		const initState = res;
		const renderApp = (Component, initState) => {
			const store = configureStore({
				app: { auth: { type: initState } },
			});
			ReactDOM.render(
				<Provider store={store}>
					<Component />
				</Provider>,
				document.getElementById('root')
			);
		};
		renderApp(Root, initState);
	});
