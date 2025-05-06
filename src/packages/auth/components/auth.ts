import { PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';

import { MODULE, PRIVILEGE, STRATEGY, usePrivileges } from '@sdk/users-api';

import { AppName } from '../../application/app-context';
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

export const hasAccessToModule = (
	module: AppName,
	privileges:
		| {
				application: MODULE;
				privileges: {
					privilege: PRIVILEGE;
					strategy: STRATEGY;
				}[];
		  }[]
		| undefined,
) => {
	if (!privileges || privileges.length === 0) {
		return false;
	}

	const modulePrefixMap: Record<AppName, string> = {
		concepts: 'CONCEPT',
		classifications: 'CLASSIFICATION',
		operations: 'OPERATION',
		structures: 'STRUCTURE',
		codelists: 'CODESLIST',
		datasets: 'DATASET',
	};

	const applicationPrefix = modulePrefixMap[module];
	if (!applicationPrefix) {
		return false;
	}

	return privileges.some(
		(p) =>
			p.application.startsWith(applicationPrefix) &&
			p.privileges.some((priv) => priv.strategy !== 'NONE'),
	);
};

export const HasAccess = ({
	children,
	module,
	privilege,
	fallback = null,
	complementaryCheck = true,
}: Readonly<
	PropsWithChildren<{
		module: MODULE;
		privilege: PRIVILEGE;
		fallback?: any;
		complementaryCheck?: boolean;
	}>
>) => {
	const { privileges } = usePrivileges();

	if (!privileges) {
		return fallback;
	}
	const currentModule = privileges.find((d) => d.application === module);
	const currentPrivilege = currentModule?.privileges.find(
		(p) => p.privilege === privilege,
	);

	const isAuthorized = currentPrivilege?.strategy === 'ALL';

	if (!isAuthorized || !complementaryCheck) {
		return fallback;
	}
	return children;
};

export default AuthDumb;
