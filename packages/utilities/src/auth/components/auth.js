import { getPermission } from '../selectors';
import { connect } from 'react-redux';
import { UsersAction } from '../../stores';

export const mapStateToProps = (state) => {
	return {
		userRoles: getPermission(state).roles,
		userStamp: UsersAction.getStamp(state)
	};
};

/**
 * <AuthDumb
 * 	roles: ['ADMIN', ['CONTRIBUTOR', stamp => isUserStampValid()]]>
 * 	<button />
 * </AuthDumb>
 */
export function AuthDumb({
	children,
	userRoles,
	userStamp,
	roles,
	fallback = null,
	complementaryCheck = true,
}) {
	const isAuthorized = !!roles.find((role) => {
		if(Array.isArray(role)){
			const [r, check] = role
			return userRoles.includes(r) && check(userStamp);
		}

		return userRoles.includes(role)
	});
	if (!isAuthorized || !complementaryCheck) {
		return fallback;
	}
	return children;
}
export default connect(mapStateToProps)(AuthDumb);
