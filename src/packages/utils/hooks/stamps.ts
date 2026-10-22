import { useQuery } from "@tanstack/react-query";

import { StampsApi, V2Api } from "@sdk/index";

export const useStamps = () =>
  useQuery({
    queryKey: ["stamps"],
    // Référentiel stable en cours de session : lu une seule fois.
    staleTime: Infinity,
    queryFn: () => {
      return StampsApi.getStamps() as Promise<string[]>;
    },
  });

export const useV2Stamps = () =>
  useQuery({
    queryKey: ["v2-stamps"],
    // Référentiel stable en cours de session : lu une seule fois.
    staleTime: Infinity,
    queryFn: () => {
      return V2Api.getStamps() as Promise<{ stamp: string; label: string }[]>;
    },
  });

export const useStampsOptions = () => {
  const { data = [] } = useStamps();

  return data.map((stamp: string) => ({
    value: stamp,
    label: stamp,
  }));
};

export const useV2StampsOptions = () => {
  const { data = [] } = useV2Stamps();

  return data.map(({ stamp, label }: { stamp: string; label: string }) => ({
    value: stamp,
    label: label,
  }));
};
