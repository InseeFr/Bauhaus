import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useGoBackOrReplace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return useCallback(
    (defaultRoute, forceRedirect) => {
      if (forceRedirect) {
        if (history.length === 1 || location.state) {
          navigate(defaultRoute);
        } else {
          navigate(-1);
        }
      } else {
        navigate(defaultRoute, { replace: true });
      }
    },
    [navigate, location],
  );
};
