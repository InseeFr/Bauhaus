import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../../../application/app-context";
import { PhysicalInstanceLabel } from "./PhysicalInstanceLabel";
import type { PhysicalInstanceUpdateData } from "../../components/PhysicalInstanceCreationDialog/PhysicalInstanceCreationDialog";

interface PhysicalInstanceHeaderProps {
  label: string;
  onSave: (data: PhysicalInstanceUpdateData) => Promise<void>;
  onLanguageChange: (lang: string) => void;
}

export const PhysicalInstanceHeader = ({
  label,
  onSave,
  onLanguageChange,
}: Readonly<PhysicalInstanceHeaderProps>) => {
  const { t } = useTranslation();
  const { properties } = useAppContext();
  const langs = properties.colecticaLangs ?? [];
  const [selectedLang, setSelectedLang] = useState(langs[0] ?? "");

  const handleLangChange = (lang: string) => {
    setSelectedLang(lang);
    onLanguageChange(lang);
  };

  const langOptions = langs.map((lang) => ({ label: lang, value: lang }));

  return (
    <div className="flex align-items-center gap-2 mb-3">
      {langs.length > 1 && (
        <Dropdown
          value={selectedLang}
          options={langOptions}
          onChange={(e) => handleLangChange(e.value)}
          aria-label={t("physicalInstance.view.selectLanguage")}
        />
      )}
      <PhysicalInstanceLabel label={label} onSave={onSave} />
    </div>
  );
};
