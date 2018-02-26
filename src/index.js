import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Root from 'js/components/Root';
import configureStore from 'js/store/configure-store';
import Api from 'js/remote-api/api';
import './css/index.css';

// TODO Loading spinner ??
Api.getInit()
	.then(
		res => {
			if (res.ok) {
				return res.json();
			} else return Promise.reject(res.statusText);
		},
		err => Promise.reject(err.toString())
	)
	.then(res => {
		const initState = res;
		const renderApp = (Component, initState) => {
			const { authType: type, ...properties } = initState;
			const store = configureStore({
				app: { auth: { type }, properties, secondLang: false },
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
