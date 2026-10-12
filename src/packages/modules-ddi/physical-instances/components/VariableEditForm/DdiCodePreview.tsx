import { Button } from "primereact/button";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { exceedsClipboardSafeSize } from "../../../utils/clipboard";
import { downloadTextFile } from "../../../utils/downloadTextFile";
import { CodeBlock } from "./CodeBlock";
import type { HighlightLanguage } from "./useHighlight";
import "./DdiPreview.css";

const MIME_TYPES: Record<HighlightLanguage, string> = {
  xml: "application/xml",
  json: "application/json",
};

interface DdiCodePreviewProps {
  code: string;
  language: HighlightLanguage;
  /** Nom du fichier téléchargé. */
  fileName: string;
}

export const DdiCodePreview = ({ code, language, fileName }: Readonly<DdiCodePreviewProps>) => {
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
            void navigator.clipboard.writeText(code);
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
            onClick={() => downloadTextFile(code, fileName, MIME_TYPES[language])}
          />
        )}
      </div>
      <CodeBlock code={code} language={language} />
    </div>
  );
};
