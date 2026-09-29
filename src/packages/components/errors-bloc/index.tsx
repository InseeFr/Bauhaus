import { useTranslation } from "react-i18next";

import { appI18n } from "../../i18n";
import { formatApiErrors } from "../../utils/api-errors";
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
