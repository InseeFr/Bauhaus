import { useAppContext } from "../../application/app-context";

export const useLocales = (): { lg1: string; lg2: string } => {
  const { lg1, lg2 } = useAppContext();
  return { lg1, lg2 };
};
