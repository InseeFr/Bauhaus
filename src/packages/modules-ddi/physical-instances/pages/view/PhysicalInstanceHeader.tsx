import type {
  PhysicalInstanceUpdateData,
  SelectedGroup,
  SelectedStudyUnit,
} from "../../components/PhysicalInstanceCreationDialog/PhysicalInstanceCreationDialog";
import { PhysicalInstanceBreadcrumb } from "./PhysicalInstanceBreadcrumb";
import { PhysicalInstanceLabel } from "./PhysicalInstanceLabel";

interface PhysicalInstanceHeaderProps {
  label: string;
  onSave: (data: PhysicalInstanceUpdateData) => Promise<void>;
  /** `operationsIri` : série dont le groupe est le miroir, cible de son lien dans le fil d'Ariane. */
  group?: SelectedGroup & { operationsIri?: string | null };
  /** `operationsIri` : opération dont l'étude est le miroir, cible de son lien dans le fil d'Ariane. */
  studyUnit?: SelectedStudyUnit & { operationsIri?: string | null };
  /** Libellé du groupe parent, affiché dans le fil d'Ariane. */
  groupLabel?: string;
  /** Libellé de l'étude parente, affiché dans le fil d'Ariane. */
  studyUnitLabel?: string;
  /** PI courante : dernier segment du fil d'Ariane, d'où l'on change de PI. */
  physicalInstance: { agency: string; id: string };
  stamps?: string[];
}

export const PhysicalInstanceHeader = ({
  label,
  onSave,
  group,
  studyUnit,
  groupLabel,
  studyUnitLabel,
  physicalInstance,
  stamps,
}: Readonly<PhysicalInstanceHeaderProps>) => (
  <div className="mb-3">
    <PhysicalInstanceBreadcrumb
      group={
        group && groupLabel
          ? { id: group.id, label: groupLabel, operationsIri: group.operationsIri }
          : undefined
      }
      studyUnit={studyUnit && studyUnitLabel ? { ...studyUnit, label: studyUnitLabel } : undefined}
      physicalInstance={{ ...physicalInstance, label }}
    />
    <PhysicalInstanceLabel
      label={label}
      onSave={onSave}
      group={group}
      studyUnit={studyUnit}
      stamps={stamps}
    />
  </div>
);
