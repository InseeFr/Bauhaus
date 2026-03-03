import { Outlet, useNavigation } from "react-router-dom";

import { Loading } from "@components/loading";

import { useTheme } from "@utils/hooks/useTheme";

import Menu from "../menu";

export const Component = () => {
  useTheme("operations");
  const navigation = useNavigation();

  return (
    <>
      <Menu />
      {navigation.state === "loading" ? <Loading /> : <Outlet />}
    </>
  );
};
