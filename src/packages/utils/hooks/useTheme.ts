import { useEffect } from "react";

import { AppName } from "../../application/app-context";

const THEMES: AppName[] = [
  "concepts",
  "classifications",
  "operations",
  "structures",
  "codelists",
  "datasets",
  "ddi",
];

export const useTheme = (application: AppName) => {
  useEffect(() => {
    const rootApp = document.getElementById("root-app");

    if (rootApp !== null) {
      rootApp.removeAttribute("class");
      rootApp.classList.add(application);
    }

    // Les overlays PrimeReact (Sidebar, Dialog…) sont rendus dans le body,
    // hors de #root-app : le thème doit y être posé pour qu'ils en héritent.
    document.body.classList.remove(...THEMES);
    document.body.classList.add(application);
  }, []);
};
