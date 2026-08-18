import { Tag } from "primereact/tag";
import { useTranslation } from "react-i18next";
import { PhysicalInstanceLabel } from "./PhysicalInstanceLabel";
import { StudyUnitTag } from "./StudyUnitTag";
import type {
  PhysicalInstanceUpdateData,
  SelectedGroup,
  SelectedStudyUnit,
} from "../../components/PhysicalInstanceCreationDialog/PhysicalInstanceCreationDialog";

interface PhysicalInstanceHeaderProps {
  label: string;
  onSave: (data: PhysicalInstanceUpdateData) => Promise<void>;
  group?: SelectedGroup;
  studyUnit?: SelectedStudyUnit;
  /** Libellé du groupe parent, affiché en tag sous le titre. */
  groupLabel?: string;
  /** Libellé de l'étude parente, affiché en tag sous le titre. */
  studyUnitLabel?: string;
  /** PI courante, exclue de la liste déroulante des PI de l'étude. */
  physicalInstance?: { agency: string; id: string };
  stamps?: string[];
}

// Tags parents « groupe » / « étude » : gris, plus gros que la taille PrimeReact par défaut.
// Couleur forcée en dur car le token `severity="secondary"` de PrimeReact rend bleu
// sur ce thème (tokens --p-* absents, cf. souci PrimeFlex 4 / PrimeReact 10).
const tagStyle = {
  fontSize: "1rem",
  padding: "0.4rem 0.7rem",
  backgroundColor: "#6c757d",
  color: "#ffffff",
};

// Masquage temporaire des tags parents. Typé `boolean` et non `false` : un littéral rendrait le
// bloc JSX inatteignable, et TypeScript n'y applique alors plus le narrowing des gardes.
const SHOW_PARENT_TAGS: boolean = false;

export const PhysicalInstanceHeader = ({
  label,
  onSave,
  group,
  studyUnit,
  groupLabel,
  studyUnitLabel,
  physicalInstance,
  stamps,
}: Readonly<PhysicalInstanceHeaderProps>) => {
  const { t } = useTranslation();

  return (
    <div className="mb-3">
      <PhysicalInstanceLabel
        label={label}
        onSave={onSave}
        group={group}
        studyUnit={studyUnit}
        stamps={stamps}
      />
      {/* Tags parents « groupe » / « étude » masqués temporairement. */}
      {SHOW_PARENT_TAGS && (groupLabel || studyUnitLabel) && (
        <div className="flex align-items-center gap-2 flex-wrap">
          {groupLabel && (
            <Tag
              icon="pi pi-folder"
              style={tagStyle}
              value={t("physicalInstance.view.groupTag", { label: groupLabel })}
            />
          )}
          {studyUnitLabel && studyUnit && (
            <StudyUnitTag
              label={studyUnitLabel}
              studyUnit={studyUnit}
              currentPhysicalInstance={physicalInstance}
              style={tagStyle}
            />
          )}
        </div>
      )}
    </div>
  );
};
