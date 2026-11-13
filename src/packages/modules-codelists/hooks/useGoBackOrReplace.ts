import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";

export const useGoBackOrReplace = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (defaultRoute: string, forceRedirect?: boolean) => {
      if (forceRedirect) {
        if (history.length === 1 || location.state) {
          void navigate(defaultRoute);
        } else {
          void navigate(-1);
        }
      } else {
        void navigate(defaultRoute, { replace: true });
      }
    },
    [navigate, location],
  );
};
