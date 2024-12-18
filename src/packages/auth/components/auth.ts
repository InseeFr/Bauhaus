import { PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';

import { ReduxModel } from '../../redux/model';
import { getPermission } from '../../redux/selectors';

export type RoleCheck = string | [string, (value: string) => boolean];
export type RoleChecks = RoleCheck[];
interface AuthDumbTypes {
	roles: RoleChecks;
	fallback?: any;
	complementaryCheck?: boolean;
}

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
}: Readonly<PropsWithChildren<AuthDumbTypes>>) {
	const { roles: userRoles, stamp: userStamp } = useSelector(
		(state: ReduxModel) => getPermission(state),
	);

	const isAuthorized = !!roles.find((role) => {
		if (Array.isArray(role)) {
			if (userStamp) {
				const [r, check] = role;
				return userRoles?.includes(r) && check(userStamp);
			}
			return false;
		}
		return userRoles?.includes(role);
	});
	if (!isAuthorized || !complementaryCheck) {
		return fallback;
	}
	return children;
}
export default AuthDumb;
