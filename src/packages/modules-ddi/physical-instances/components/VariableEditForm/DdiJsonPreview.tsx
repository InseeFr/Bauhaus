import { Button } from "primereact/button";
import { useTranslation } from "react-i18next";
import { useHighlight } from "./useHighlight";
import "./DdiPreview.css";

interface DdiJsonPreviewProps {
  code: string;
}

export const DdiJsonPreview = ({ code }: Readonly<DdiJsonPreviewProps>) => {
  const { t } = useTranslation();
  const highlightedHtml = useHighlight(code, "json");

  return (
    <div className="ddi-preview-code-container">
      <Button
        className="ddi-preview-copy-btn"
        icon="pi pi-copy"
        label={t("physicalInstance.view.copyCode")}
        outlined
        size="small"
        onClick={() => {
          navigator.clipboard.writeText(code);
        }}
      />
      <pre className="ddi-preview-code">
        <code
          className="hljs language-json"
          dangerouslySetInnerHTML={{
            __html: highlightedHtml ?? code,
          }}
        />
      </pre>
    </div>
  );
};
