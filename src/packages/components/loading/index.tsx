import { ProgressSpinner } from "primereact/progressspinner";
import D from "../i18n";

const getText = (textType?: string) => {
  switch (textType) {
    case "authentification":
      return D.loading.auth;
    case "saving":
      return D.loading.saving;
    case "deleting":
      return D.loading.deleting;
    case "sending":
      return D.loading.sending;
    case "exporting":
      return D.loading.exporting;
    case "validating":
      return D.loading.validating;
    case "loading":
    default:
      return D.loading.loading;
  }
};

interface LoadingTypes {
  text?: string;
  textType?: string;
}

export const Loading = ({ text, textType }: LoadingTypes) => {
  const content = text || getText(textType);

  return (
    <div
      className="flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "400px" }}
      role="status"
      aria-live="polite"
      aria-label={content}
    >
      <ProgressSpinner />
      <p>{content}</p>
    </div>
  );
};

export const Deleting = () => <Loading textType="deleting" />;
export const Publishing = () => <Loading textType="validating" />;
export const Saving = () => <Loading textType="saving" />;
export const Exporting = () => <Loading textType="exporting" />;
