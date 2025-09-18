import { PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';

import {
	MODULE,
	Privilege,
	PRIVILEGE,
	usePrivileges,
} from '@utils/hooks/users';

import { AppName } from '../../application/app-context';
import { ReduxModel } from '../../redux/model';
import { getPermission } from '../../redux/selectors';

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

export const HasAccess = ({
	children,
	module,
	privilege,
	stamps: stampsProps = [],
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
	const stamps = Array.isArray(stampsProps) ? stampsProps : [stampsProps];

	const { privileges } = usePrivileges();
	const { stamp } = useSelector((state: ReduxModel) => getPermission(state));
	if (!privileges) {
		return null;
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

	if (!isAuthorized) {
		return null;
	}
	return children;
};
