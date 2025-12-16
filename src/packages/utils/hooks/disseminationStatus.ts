import { useQuery } from "@tanstack/react-query";

import { DisseminationStatus } from "@sdk/dissemination-status";

import { Options } from "../../model/SelectOption";

export const useDisseminationStatus = () => {
  return useQuery({
    queryKey: ["dissemination-status"],
    queryFn: () => {
      return DisseminationStatus.getDisseminationStatus() as Promise<any[]>;
    },
  });
};

export const useDisseminationStatusOptions = (): Options => {
  const { data = [] } = useDisseminationStatus();
  return data.map(({ url, label }) => ({ value: url, label }));
};
