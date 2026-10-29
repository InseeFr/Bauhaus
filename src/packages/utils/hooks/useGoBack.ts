import { useLocation, useNavigate } from "react-router";

export function useGoBack() {
  const navigate = useNavigate();

  const location = useLocation();

  return function (redirectUrl: string, shouldReplace = false) {
    if (shouldReplace) {
      void navigate(redirectUrl, { replace: true });
      return;
    }

    if (history.length === 1 || location.state) {
      void navigate(redirectUrl);
    } else {
      void navigate(-1);
    }
  };
}
