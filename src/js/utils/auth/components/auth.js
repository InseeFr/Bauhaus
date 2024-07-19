import { getPermission } from '../selectors';
import { useSelector } from 'react-redux';

/**
 * <AuthDumb
 * 	roles: ['ADMIN', ['CONTRIBUTOR', stamp => isUserStampValid()]]>
 * 	<button />
 * </AuthDumb>
 */
export function AuthDumb({
	children,
	roles,
	fallback = null,
	complementaryCheck = true,
}) {
	const userRoles = useSelector((state) => getPermission(state).roles);
	const userStamp = useSelector((state) => getPermission(state).stamp);

	const isAuthorized = !!roles.find((role) => {
		if (Array.isArray(role)) {
			const [r, check] = role;
			return userRoles.includes(r) && check(userStamp);
		}
		return userRoles.includes(role);
	});
	if (!isAuthorized || !complementaryCheck) {
		return fallback;
	}
	return children;
}
export default AuthDumb;
