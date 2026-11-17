/** Formulaire de création/modification d'une PhysicalInstance, les trois libellés valant `label`. */
export const physicalInstanceFormData = (label = "Test Label") => ({
  physicalInstanceLabel: label,
  dataRelationshipLabel: label,
  logicalRecordLabel: label,
  groupId: "group-1",
  groupAgency: "fr.insee",
  studyUnitId: "su-1",
  studyUnitAgency: "fr.insee",
});
