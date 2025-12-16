import { PropsWithChildren } from "react";

import D from "../../../deprecated-locales";
import { MetadataStructure } from "../../../model/Sims";
import { Status, useLayout } from "../../useLayout";
import Outline from "../outline";
import "./style.scss";

interface MSDComponentTypes {
  baseUrl: string;
  disableSectionAnchor: boolean;
  storeCollapseState: boolean;
  metadataStructure: Record<string, MetadataStructure>;
}
const MSDComponent = ({
  storeCollapseState,
  metadataStructure,
  children,
  baseUrl,
  disableSectionAnchor,
}: Readonly<PropsWithChildren<MSDComponentTypes>>) => {
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
    <div id="consulter-sommaire" className="container msd__container">
      <section className="msd__outline" style={styleSummary}>
        <div className="msd__outline_title">{D.helpSummary}</div>
        <nav className="msd__outline-container">
          <ul className="msd__outline-content">
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
        <button type="button" className="msd__panel-trigger_left" onClick={changeStatusToBoth}>
          {D.helpSummary}
          <span className="glyphicon glyphicon-chevron-right" />
        </button>
      )}
      {status === Status.BOTH && (
        <div className="msd__panel-trigger_middle">
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
        <button type="button" className="msd__panel-trigger_right" onClick={changeStatusToBoth}>
          <span className="glyphicon glyphicon-chevron-left" />
          {D.helpContent}
        </button>
      )}
      <section
        style={styleContent}
        className={status === Status.CONTENT ? "msd__content_alone" : "msd__content"}
      >
        {children}
      </section>
    </div>
  );
};

export default MSDComponent;
