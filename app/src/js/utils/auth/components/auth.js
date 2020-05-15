import { Auth } from 'bauhaus-utilities';
import { connect } from 'react-redux';

export const mapStateToProps = state => {
	return {
		userRoles: Auth.getPermission(state).roles,
	};
};

export function AuthDumb({
	children,
	userRoles,
	roles,
	fallback = null,
	complementaryCheck = true,
}) {
	const isAuthorized = !!roles.find(role => userRoles.includes(role));
	if (!isAuthorized || !complementaryCheck) {
		return fallback;
	}
	return children;
}
export default connect(mapStateToProps)(AuthDumb);
