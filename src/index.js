import React from 'react';
import ReactDOM from 'react-dom';
import Root from './js/components/Root';
import './css/index.css';

// const initialFetch = window.fetch;
// window.fetch = (...args) => {
// 	const p = new Promise((accept, reject) => {
// 		initialFetch(...args).then(res => {
// 			const json = res.json();
// 			accept(json);
// 		});
// 		return p;
// 	});
// };
ReactDOM.render(<Root />, document.getElementById('root'));
