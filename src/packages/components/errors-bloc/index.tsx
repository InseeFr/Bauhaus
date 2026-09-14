import { useTranslation } from "react-i18next";

import { appI18n } from "../../i18n";
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

  return <div id={id} className="text-danger" dangerouslySetInnerHTML={{ __html: error }}></div>;
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
  const { t, i18n } = useTranslation("translation", { i18n: appI18n });

  if (!error) {
    return null;
  }

  const errors = Array.isArray(error) ? error : [error];

  const formattedErrors = errors
    .filter((e) => !!e)
    .map((e) => {
      let errorMsg;
      try {
        const parsedError = e !== null && typeof e === "object" ? e : JSON.parse(e);
        if (parsedError.code && i18n.exists(`errors.${parsedError.code}`)) {
          errorMsg = t(`errors.${parsedError.code}`, parsedError);
        } else if (parsedError.message && i18n.exists(`errors.${parsedError.message}`)) {
          errorMsg = t(`errors.${parsedError.message}`, parsedError);
        } else if (parsedError.status === 500) {
          errorMsg = t("errors.serversideErrors500", { error: parsedError.message });
        } else {
          errorMsg = parsedError.message;
        }
      } catch {
        errorMsg = e;
      }
      return errorMsg;
    });

  return formattedErrors.map((e, index) => (
    <div key={index} className="bauhaus-error-bloc alert alert-danger" role="alert">
      <div dangerouslySetInnerHTML={{ __html: e }} />
    </div>
  ));
};
