import { useEffect } from 'react';
import { getPermission } from '../selectors';
import { connect } from 'react-redux';
import { UsersAction } from '../../stores';

export const mapStateToProps = (state) => {
	return {
		userRoles: getPermission(state).roles,
		userStamp: UsersAction.getStamp(state),
		isLoading: UsersAction.isLoading(state)
	};
};

const mapDispatchToProps = {
	loadUserStamp: UsersAction.loadUserStamp
}
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
	loadUserStamp,
	isLoading
}) {
	useEffect(() => {
		if(!userStamp && !isLoading){
			loadUserStamp(userStamp);
		}
	}, [userStamp, isLoading])
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
export default connect(mapStateToProps, mapDispatchToProps)(AuthDumb);
