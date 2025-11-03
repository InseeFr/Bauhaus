import { useQuery } from '@tanstack/react-query';

import { UsersApi } from '@sdk/users-api';

type CONCEPT_MODULE = 'CONCEPT_CONCEPT' | 'CONCEPT_COLLECTION';
type CLASSIFICATION_MODULE =
	| 'CLASSIFICATION_FAMILY'
	| 'CLASSIFICATION_SERIES'
	| 'CLASSIFICATION_CLASSIFICATION';
type OPERATION_MODULE =
	| 'OPERATION_FAMILY'
	| 'OPERATION_SERIES'
	| 'OPERATION_OPERATION'
	| 'OPERATION_INDICATOR'
	| 'OPERATION_SIMS'
	| 'OPERATION_DOCUMENT';
type STRUCTURE_MODULE = 'STRUCTURE_STRUCTURE' | 'STRUCTURE_COMPONENT';
type CODESLIST_MODULE = 'CODESLIST_CODESLIST' | 'CODESLIST_PARTIALCODESLIST';
type DATASET_MODULE = 'DATASET_DATASET' | 'DATASET_DISTRIBUTION';
type DDI_MODULE = 'DDI_PHYSICALINSTANCE';
export type MODULE =
	| CONCEPT_MODULE
	| CLASSIFICATION_MODULE
	| OPERATION_MODULE
	| STRUCTURE_MODULE
	| CODESLIST_MODULE
	| DATASET_MODULE
	| DDI_MODULE
	| 'GEOGRAPHY';
export type PRIVILEGE =
	| 'READ'
	| 'CREATE'
	| 'UPDATE'
	| 'PUBLISH'
	| 'DELETE'
	| 'ADMINISTRATION';
export type STRATEGY = 'ALL' | 'STAMP' | 'NONE';

export interface Privilege {
	application: MODULE;
	privileges: {
		privilege: PRIVILEGE;
		strategy: STRATEGY;
	}[];
}

export const usePrivileges = (): { privileges: Privilege[] } => {
	const { data: privileges } = useQuery({
		queryKey: ['users'],
		queryFn: () => UsersApi.getInfo(),
	});
	return { privileges };
};
