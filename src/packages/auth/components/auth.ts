import { PropsWithChildren } from 'react';

import {
	MODULE,
	Privilege,
	PRIVILEGE,
	usePrivileges,
} from '@utils/hooks/users';

import { AppName } from '../../application/app-context';
import { usePermission } from '../../redux/hooks/usePermission';

export type RoleCheck = string | [string, (value: string) => boolean];
export type RoleChecks = RoleCheck[];

export const hasAccessToModule = (
	module: AppName,
	privileges: Privilege[] | undefined,
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
		ddi: 'DDI',
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

export interface AuthorizationGuardOptions {
	module: MODULE;
	privilege: PRIVILEGE;
	stamps?: string[];
	complementaryCheck?: boolean;
	check?: (stamp: string) => boolean;
}

export const useAuthorizationGuard = ({
	module,
	privilege,
	stamps: stampsProps = [],
	complementaryCheck = true,
	check = () => true,
}: AuthorizationGuardOptions): boolean => {
	const stamps = Array.isArray(stampsProps) ? stampsProps : [stampsProps];

	const { privileges } = usePrivileges();
	const { stamp } = usePermission();

	if (!privileges) {
		return false;
	}

	const currentModule = privileges.find((d) => d.application === module);
	const currentPrivilege = currentModule?.privileges.find(
		(p) => p.privilege === privilege,
	);

	const isAuthorized =
		currentPrivilege?.strategy === 'ALL' ||
		(currentPrivilege?.strategy === 'STAMP' &&
			(stamps.includes(stamp) || stamps.length === 0) &&
			complementaryCheck &&
			check(stamp));

	return isAuthorized;
};

export const HasAccess = ({
	children,
	module,
	privilege,
	stamps = [],
	complementaryCheck = true,
	check = () => true,
}: Readonly<
	PropsWithChildren<{
		module: MODULE;
		privilege: PRIVILEGE;
		fallback?: any;
		complementaryCheck?: boolean;
		stamps?: string[];
		check?: (stamp: string) => boolean;
	}>
>) => {
	const isAuthorized = useAuthorizationGuard({
		module,
		privilege,
		stamps,
		complementaryCheck,
		check,
	});

	if (!isAuthorized) {
		return null;
	}
	return children;
};
