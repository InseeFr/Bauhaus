import { createAllDictionary } from "@utils/dictionnary";

import "./index.css";

const { D } = createAllDictionary({
  welcome: {
    fr: "Application de gestion des métadonnées de référence",
    en: "Metadata management application",
  },
});
export const ApplicationTitle = () => {
  return (
    <header className="application-title">
      <div className="application-title-container">
        <div className="application-title-wrapper flex">
          <h1 className="flex">
            <img src="/img/logo.svg" alt="application logo" />
            {D.welcome}
          </h1>
        </div>
      </div>
    </header>
  );
};
