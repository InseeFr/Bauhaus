import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Loading } from '@inseefr/wilco';
import {
	ADMIN,
	INDICATOR_CONTRIBUTOR,
	SERIES_CONTRIBUTOR,
} from 'bauhaus-utilities/src/auth/roles';
import { checkAuth } from '../../../store/users';

const LoginNoAuth = ({ checkAuth }) => {
	useEffect(() => {
		checkAuth({
			stamp: 'XXXXXX',
			roles: [ADMIN, SERIES_CONTRIBUTOR, INDICATOR_CONTRIBUTOR],
		});
	}, [checkAuth])
	return <Loading textType="authentification" />;
}

const mapDispatchToProps = {
	checkAuth,
};

export default connect(null, mapDispatchToProps)(LoginNoAuth);
