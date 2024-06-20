import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Loading } from '@inseefr/wilco';
import {
	ADMIN,
	CODELIST_CONTRIBUTOR,
	DATASET_CONTRIBUTOR,
	INDICATOR_CONTRIBUTOR,
	SERIES_CONTRIBUTOR,
	STRUCTURE_CONTRIBUTOR,
} from 'js/utils/auth/roles';
import { checkAuth } from '../../../store/users';

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
