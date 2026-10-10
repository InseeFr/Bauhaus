import { forwardRef } from "react";

import { Toast } from "@components/ui/toast";

import "./DdiToast.css";

/**
 * Toast du module DDI, centré en haut de l'écran et plus large que celui de PrimeReact :
 * les erreurs serveur (souvent longues) y restent lisibles et proches de la zone d'action.
 */
export const DdiToast = forwardRef<Toast>((_props, ref) => (
  <Toast ref={ref} position="top-center" className="ddi-toast" />
));

DdiToast.displayName = "DdiToast";
