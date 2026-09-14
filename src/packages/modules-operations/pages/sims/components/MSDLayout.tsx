import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

import { MetadataStructure } from "@model/Sims";

import { Status, useLayout } from "../../../hooks/useLayout";
import { Outline } from "./Outline";
import "./MSDLayout.css";
import "../../../../components/panel-trigger/panel-trigger.css";

interface MSDComponentTypes {
  baseUrl: string;
  disableSectionAnchor: boolean;
  storeCollapseState: boolean;
  metadataStructure: Record<string, MetadataStructure>;
}

export const MSDLayout = ({
  storeCollapseState,
  metadataStructure,
  children,
  baseUrl,
  disableSectionAnchor,
}: Readonly<PropsWithChildren<MSDComponentTypes>>) => {
  const { t } = useTranslation();

  const [status, changeStatus] = useLayout();

  const changeStatusToBoth = () => changeStatus(Status.BOTH);
  const changeStatusToContent = () => changeStatus(Status.CONTENT);
  const changeStatusToSummary = () => changeStatus(Status.SUMMARY);

  const styleSummary = {
    width: status === Status.BOTH ? "30%" : "100%",
    display: status === Status.CONTENT ? "none" : "block",
  };
  const styleContent = {
    width: status === Status.BOTH ? "70%" : "100%",
    display: status === Status.SUMMARY ? "none" : "block",
  };

  return (
    <div id="consulter-sommaire" className="container msd-container">
      <section className="msd-outline" style={styleSummary}>
        <div className="msd-outline-title">{t("sims.helpSummary")}</div>
        <nav className="msd-outline-container">
          <ul className="msd-outline-content">
            {Object.values(metadataStructure).map((metadata) => (
              <Outline
                key={metadata.idMas}
                storeCollapseState={storeCollapseState}
                metadataStructure={metadata}
                baseUrl={baseUrl}
                disableSectionAnchor={disableSectionAnchor}
              />
            ))}
          </ul>
        </nav>
      </section>
      {status === Status.CONTENT && (
        <button type="button" className="msd-panel-trigger-left" onClick={changeStatusToBoth}>
          {t("sims.helpSummary")}
          <span className="glyphicon glyphicon-chevron-right" />
        </button>
      )}
      {status === Status.BOTH && (
        <div className="msd-panel-trigger-middle">
          <div>
            <button type="button" onClick={changeStatusToContent} title="open content">
              <span className="glyphicon glyphicon-chevron-left" />
            </button>
          </div>
          <div>
            <button type="button" onClick={changeStatusToSummary} title="open summary">
              <span className="glyphicon glyphicon-chevron-right" />
            </button>
          </div>
        </div>
      )}
      {status === Status.SUMMARY && (
        <button type="button" className="msd-panel-trigger-right" onClick={changeStatusToBoth}>
          <span className="glyphicon glyphicon-chevron-left" />
          {t("sims.helpContent")}
        </button>
      )}
      <section
        style={styleContent}
        className={status === Status.CONTENT ? "msd-content-alone" : "msd-content"}
      >
        {children}
      </section>
    </div>
  );
};
