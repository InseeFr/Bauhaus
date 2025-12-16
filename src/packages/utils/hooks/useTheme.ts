import { useEffect } from "react";

export const useTheme = (application: string) => {
  useEffect(() => {
    const rootApp = document.getElementById("root-app");
    if (rootApp !== null) {
      rootApp.removeAttribute("class");
      rootApp.classList.add(application);
    }
  }, []);
};
