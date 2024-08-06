import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Loading } from '../../../new-architecture/components';
import {
	ADMIN,
	CODELIST_CONTRIBUTOR,
	DATASET_CONTRIBUTOR,
	INDICATOR_CONTRIBUTOR,
	SERIES_CONTRIBUTOR,
	STRUCTURE_CONTRIBUTOR,
} from '../../../utils/auth/roles';
import { checkAuth } from '../../../new-architecture/redux/users';

const LoginNoAuth = ({ checkAuth }) => {
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
