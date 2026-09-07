import { datableNoteFields, versionableNoteFields } from "./conceptNoteFieldGroups";

export const conceptNoteFields = [...versionableNoteFields, ...datableNoteFields];
