import { createRoot } from 'react-dom/client';
import { Provider, useDispatch, useSelector } from 'react-redux';

import { Select } from '@components/select-rmes';

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
} from '../packages/auth/roles';
import D from '../packages/deprecated-locales';
import { CHECK_AUTH } from '../packages/redux/users';

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

		const value = options.filter(({ value }) =>
			rolesAndStamps.roles.includes(value),
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
