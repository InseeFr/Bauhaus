import { QB } from "./prefixes";

export const DATA_SET = `${QB}DataSet`;
export const OBSERVATION = `${QB}Observation`;
export const SLICE = `${QB}Slice`;

export const ATTACHMENTS = [
  { value: OBSERVATION, label: "Observation" },
  { value: DATA_SET, label: "DataSet" },
  { value: SLICE, label: "Slice" },
] as const;
