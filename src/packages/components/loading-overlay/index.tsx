import { ProgressSpinner } from "primereact/progressspinner";
import { getLoadingText } from "../loading/getLoadingText";
import "./loading-overlay.css";

interface LoadingOverlayProps {
  text?: string;
  textType?: string;
}

/**
 * Loader plein écran affiché au-dessus de toute la page (fond grisé),
 * pour les opérations bloquantes (sauvegarde, publication, ...).
 * Sans `text`, le message vient du dictionnaire partagé selon `textType`
 * (mêmes valeurs que le composant Loading : "saving", "loading", ...).
 */
export const LoadingOverlay = ({ text, textType }: LoadingOverlayProps) => {
  const content = text || getLoadingText(textType);

  return (
    <div className="loading-overlay" role="status" aria-live="polite" aria-label={content}>
      <ProgressSpinner />
      <p className="loading-overlay-text">{content}</p>
    </div>
  );
};
