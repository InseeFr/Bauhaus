import React from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import {
	ADMIN,
	COLLECTIONS_CREATOR,
	CONCEPT_CONTRIBUTOR,
	CONCEPTS_CONTRIBUTOR,
	CONCEPTS_CREATOR,
	INDICATOR_CONTRIBUTOR,
	SERIES_CONTRIBUTOR,
	DATASET_CONTRIBUTOR,
	CODELIST_CONTRIBUTOR,
	STRUCTURE_CONTRIBUTOR,
} from 'bauhaus-utilities/src/auth/roles';
import Select from 'react-select';
import D from 'js/i18n';
import { createRoot } from 'react-dom/client';
import { CHECK_AUTH } from '../js/store/users';

const options = [
	ADMIN,
	CONCEPTS_CREATOR,
	COLLECTIONS_CREATOR,
	CONCEPTS_CONTRIBUTOR,
	CONCEPT_CONTRIBUTOR,
	INDICATOR_CONTRIBUTOR,
	SERIES_CONTRIBUTOR,
	DATASET_CONTRIBUTOR,
	CODELIST_CONTRIBUTOR,
	STRUCTURE_CONTRIBUTOR,
].map((role) => ({ value: role, label: role }));

function install(store) {
	import('./dev-tools.scss');
	window.devToolsEnabled = true;
	// load local dev tools if it's there
	// NOTE: this is using some webpack-sepecific features.
	// if you're not using webpack, you might consider using
	// https://npm.im/preval.macro or https://npm.im/codegen.macro
	const requireDevToolsLocal = require.context(
		'./',
		false,
		/dev-tools\.local\.js/
	);
	const local = requireDevToolsLocal.keys()[0];
	let LocalDevTools;
	if (local) {
		LocalDevTools = requireDevToolsLocal(local).default;
	}
	LocalDevTools = LocalDevTools || (() => null);

	function AdminTool() {
		const rolesAndStamps = useSelector((state) => state.app.auth.user);
		const dispatch = useDispatch();

		const changeRoles = (value) => {
			dispatch({
				type: CHECK_AUTH,
				payload: {
					...rolesAndStamps,
					roles: value.map(({ value }) => value),
				},
			});
		};

		const value = options.filter(
			({ value }) => rolesAndStamps.roles.indexOf(value) >= 0
		);
		return (
			<div>
				<label style={{ width: '100%' }}>
					{D.pickedRolePlaceholder}
					<Select
						options={options}
						value={value}
						multi={true}
						onChange={(value) => changeRoles(value)}
					/>
				</label>
			</div>
		);
	}

	function DevTools() {
		return (
			<Provider store={store}>
				<div id="dev-tools">
					<div>🛠</div>
					<div className="tools">
						<LocalDevTools />
						<AdminTool />
					</div>
				</div>
			</Provider>
		);
	}

	// add dev tools UI to the page
	const devToolsRoot = document.createElement('div');
	document.body.appendChild(devToolsRoot);
	const root = createRoot(devToolsRoot);
	root.render(<DevTools />);
}

export { install };
