import NewDictionnary from "../../i18n";
import OldDictionnary from "../../deprecated-locales";
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
  if (!clientSideErrors) {
    return null;
  }
  return clientSideErrors.length > 0 ? (
    <div className="bauhaus-error-bloc alert alert-danger" role="alert">
      {(
        <div
          dangerouslySetInnerHTML={{
            __html: NewDictionnary.errors.globalClientSideErrorBloc,
          }}
        />
      ) || <span style={{ whiteSpace: "pre-wrap" }}> </span>}
    </div>
  ) : null;
};

export const ErrorBloc = ({ error, D = OldDictionnary }: { error?: unknown; D?: any }) => {
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

        if (parsedError.code && D.errors[parsedError.code]) {
          errorMsg = D.errors[parsedError.code](parsedError);
        } else if (parsedError.message && D.errors[parsedError.message]) {
          errorMsg = D.errors[parsedError.message](parsedError);
        } else if (parsedError.status === 500) {
          errorMsg = NewDictionnary.errors.serversideErrors["500"](parsedError.message);
        } else {
          errorMsg = parsedError.message;
        }
      } catch {
        errorMsg = e;
      }
      return errorMsg;
    });
  return (
    <>
      {formattedErrors.map((e, index) => (
        <div key={index} className="bauhaus-error-bloc alert alert-danger" role="alert">
          {<div dangerouslySetInnerHTML={{ __html: e }} /> || (
            <span style={{ whiteSpace: "pre-wrap" }}> </span>
          )}
        </div>
      ))}
    </>
  );
};
