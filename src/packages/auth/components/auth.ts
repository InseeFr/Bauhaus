import { PropsWithChildren, useEffect } from 'react';
import { getPermission } from '../../redux/selectors';
import { connect } from 'react-redux';
import { ReduxModel } from '../../redux/model';
import { getStamp, isLoading, loadUserStamp } from '../../redux/users.action';

export const mapStateToProps = (state: ReduxModel) => {
	return {
		userRoles: getPermission(state).roles,
		userStamp: getStamp(state),
		isLoading: isLoading(state),
	};
};

const mapDispatchToProps = {
	loadUserStamp: loadUserStamp,
};
export type RoleCheck = string | [string, (value: string) => boolean];
export type RoleChecks = Array<RoleCheck>;
type AuthDumbTypes = {
	userRoles?: string[];
	userStamp?: string;
	roles: RoleChecks;
	fallback?: any;
	complementaryCheck?: boolean;
	loadUserStamp?: any;
	isLoading?: boolean;
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
	loadUserStamp,
	isLoading,
}: Readonly<PropsWithChildren<AuthDumbTypes>>) {
	useEffect(() => {
		if (userStamp === undefined && !isLoading) {
			loadUserStamp(userStamp);
		}
	}, [userStamp, isLoading, loadUserStamp]);
	const isAuthorized = !!roles.find((role) => {
		if (Array.isArray(role)) {
			if (!!userStamp) {
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
export default connect(mapStateToProps, mapDispatchToProps)(AuthDumb);
