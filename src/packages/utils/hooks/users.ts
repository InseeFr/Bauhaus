import { useQuery } from "@tanstack/react-query";

import { UsersApi } from "@sdk/users-api";

import type { Privilege, UserStamp } from "./rbac-constants";

export const usePrivileges = (): {
  privileges: Privilege[];
  isPending: boolean;
} => {
  const { data: privileges, isPending } = useQuery({
    queryKey: ["users"],
    queryFn: () => UsersApi.getInfo(),
  });

  return { privileges, isPending };
};

export const useUserStamps = () =>
  useQuery({
    queryKey: ["users-stamps"],
    queryFn: () => UsersApi.getStamp() as Promise<UserStamp[]>,
    placeholderData: [],
  });
