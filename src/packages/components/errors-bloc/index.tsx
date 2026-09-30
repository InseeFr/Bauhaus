import { Toast } from "primereact/toast";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { appI18n } from "../../i18n";
import { formatApiErrors, isNotFound } from "../../utils/api-errors";
import { sanitizeHtml } from "../../utils/sanitize-html";
import "./errors-bloc.css";

/**
 * Component used next to an form input.
 * Inside this component, we will display the client-side
 * error of the corresponding input.
 */
export const ClientSideError = ({
  error,
  id,
}: Readonly<{
  error?: string;
  id: string;
}>) => {
  if (!error) {
    return null;
  }

  return (
    <div
      id={id}
      className="text-danger"
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(error) }}
    ></div>
  );
};

export const GlobalClientSideErrorBloc = ({
  clientSideErrors,
}: Readonly<{
  clientSideErrors?: string[];
}>) => {
  const { t } = useTranslation("translation", { i18n: appI18n });

  if (!clientSideErrors) {
    return null;
  }

  return clientSideErrors.length > 0 ? (
    <div className="bauhaus-error-bloc alert alert-danger" role="alert">
      <div
        dangerouslySetInnerHTML={{
          __html: t("errors.globalClientSideErrorBloc"),
        }}
      />
    </div>
  ) : null;
};

export const ErrorBloc = ({ error }: { error?: unknown }) => {
  // Le hook abonne le bandeau aux changements de langue ; le texte vient de l'instance du
  // composant partagé, jamais de celle de l'écran.
  useTranslation("translation", { i18n: appI18n });

  if (!error) {
    return null;
  }

  return formatApiErrors(error, appI18n).map((e, index) => (
    <div key={index} className="bauhaus-error-bloc alert alert-danger" role="alert">
      <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(e) }} />
    </div>
  ));
};

/** Échecs de lecture déjà affichés : un même rejet ne produit qu'un toast (StrictMode, re-rendus). */
const shownLoadingErrors = new WeakSet<object>();

/**
 * Échec de lecture d'une fiche, affiché comme un échec d'enregistrement d'une instance physique :
 * un toast PrimeReact d'erreur (titre « impossible de charger », détail « introuvable » pour un 404,
 * sinon le message du serveur ou le repli selon le statut). Il reste affiché jusqu'à sa fermeture :
 * rendu à la place de l'écran, il laisse la page vide.
 */
export const LoadingErrorBloc = ({ error }: { error: unknown }) => {
  // Même règle qu'ErrorBloc : le texte vient de l'instance partagée, jamais de celle de l'écran.
  useTranslation("translation", { i18n: appI18n });

  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (typeof error === "object" && error !== null) {
      if (shownLoadingErrors.has(error)) return;
      shownLoadingErrors.add(error);
    }

    const errorMessage = isNotFound(error)
      ? appI18n.t("errors.loading.notFound")
      : formatApiErrors(error, appI18n).join(" ");

    toast.current?.show({
      severity: "error",
      summary: appI18n.t("errors.loading.failed"),
      detail: <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(errorMessage) }} />,
      sticky: true,
    });
  }, [error]);

  return <Toast ref={toast} position="top-center" className="error-toast" />;
};
