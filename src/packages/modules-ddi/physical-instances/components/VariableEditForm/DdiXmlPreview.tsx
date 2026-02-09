import { Button } from "primereact/button";
import { useTranslation } from "react-i18next";
import { useHighlight } from "./useHighlight";
import "./DdiPreview.css";

interface DdiXmlPreviewProps {
  code: string;
}

export const DdiXmlPreview = ({ code }: Readonly<DdiXmlPreviewProps>) => {
  const { t } = useTranslation();
  const highlightedHtml = useHighlight(code, "xml");

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
          className="hljs language-xml"
          dangerouslySetInnerHTML={{
            __html: highlightedHtml ?? code,
          }}
        />
      </pre>
    </div>
  );
};
