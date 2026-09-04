import { componentsI18n } from "../i18n";

export const getLoadingText = (textType?: string) => {
  switch (textType) {
    case "authentification":
      return componentsI18n.t("loading.auth");
    case "saving":
      return componentsI18n.t("loading.saving");
    case "deleting":
      return componentsI18n.t("loading.deleting");
    case "sending":
      return componentsI18n.t("loading.sending");
    case "exporting":
      return componentsI18n.t("loading.exporting");
    case "validating":
      return componentsI18n.t("loading.validating");
    case "loading":
    default:
      return componentsI18n.t("loading.loading");
  }
};
