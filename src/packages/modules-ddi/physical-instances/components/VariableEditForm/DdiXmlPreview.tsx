import { Button } from "primereact/button";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { exceedsClipboardSafeSize } from "../../../utils/clipboard";
import { downloadTextFile } from "../../../utils/downloadTextFile";
import { CodeBlock } from "./CodeBlock";
import "./DdiPreview.css";

interface DdiXmlPreviewProps {
  code: string;
  /** Nom du fichier téléchargé. */
  fileName: string;
}

export const DdiXmlPreview = ({ code, fileName }: Readonly<DdiXmlPreviewProps>) => {
  const { t } = useTranslation();
  const isTooLargeToCopy = useMemo(() => exceedsClipboardSafeSize(code), [code]);

  return (
    <div className="ddi-preview-code-container">
      <div className="ddi-preview-actions">
        <Button
          type="button"
          className="ddi-preview-copy-btn"
          icon="pi pi-copy"
          label={t("physicalInstance.view.copyCode")}
          tooltip={isTooLargeToCopy ? t("physicalInstance.view.copyCodeTooLarge") : undefined}
          tooltipOptions={{ position: "bottom" }}
          outlined
          size="small"
          onClick={() => {
            navigator.clipboard.writeText(code);
          }}
        />
        {/* Le presse-papiers de certains navigateurs tronque au-delà : le fichier, lui, est complet. */}
        {isTooLargeToCopy && (
          <Button
            type="button"
            icon="pi pi-download"
            label={t("physicalInstance.view.downloadCode")}
            outlined
            size="small"
            onClick={() => downloadTextFile(code, fileName, "application/xml")}
          />
        )}
      </div>
      <CodeBlock code={code} language="xml" />
    </div>
  );
};
