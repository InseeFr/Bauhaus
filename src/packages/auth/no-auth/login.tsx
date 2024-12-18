import { useEffect } from 'react';
import { connect } from 'react-redux';

import { Loading } from '@components/loading';

import { checkAuth } from '../../redux/users';
import {
	ADMIN,
	CODELIST_CONTRIBUTOR,
	DATASET_CONTRIBUTOR,
	INDICATOR_CONTRIBUTOR,
	SERIES_CONTRIBUTOR,
	STRUCTURE_CONTRIBUTOR,
} from '../roles';

interface LoginNoAuthTypes {
	checkAuth: (option: { stamp: string; roles: string[] }) => void;
}
const LoginNoAuth = ({ checkAuth }: Readonly<LoginNoAuthTypes>) => {
	useEffect(() => {
		checkAuth({
			stamp: 'DG33-C990',
			roles: [
				ADMIN,
				CODELIST_CONTRIBUTOR,
				DATASET_CONTRIBUTOR,
				STRUCTURE_CONTRIBUTOR,
				SERIES_CONTRIBUTOR,
				INDICATOR_CONTRIBUTOR,
			],
		});
	}, [checkAuth]);
	return <Loading textType="authentification" />;
};

const mapDispatchToProps = {
	checkAuth,
};

export default connect(null, mapDispatchToProps)(LoginNoAuth);
