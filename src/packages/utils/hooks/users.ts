import { useQuery } from "@tanstack/react-query";

import { UsersApi } from "@sdk/users-api";

import type { Privilege, UserStamp } from "./rbac-constants";

export const usePrivileges = (): {
  privileges: Privilege[];
  isPending: boolean;
} => {
  const { data: privileges, isPending } = useQuery({
    queryKey: ["users"],
    // Référentiel stable en cours de session : lu une seule fois.
    staleTime: Infinity,
    queryFn: () => UsersApi.getInfo(),
  });

  return { privileges, isPending };
};

export const useUserStamps = () =>
  useQuery({
    queryKey: ["users-stamps"],
    // Référentiel stable en cours de session : lu une seule fois.
    staleTime: Infinity,
    queryFn: () => UsersApi.getStamp() as Promise<UserStamp[]>,
    placeholderData: [],
  });
