import D from "../i18n";

export const getLoadingText = (textType?: string) => {
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
