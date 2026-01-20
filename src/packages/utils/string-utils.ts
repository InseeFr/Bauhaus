export const cleanId = (id?: string) => {
  if (!id) {
    return "";
  }
  return id.replaceAll(" ", "-").toLowerCase();
};
export const deburr = (str: string): string => {
  if (!str || typeof str !== "string") {
    return str ?? "";
  }
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const normalize = (str = ""): string => {
  if (!str || typeof str !== "string") {
    return str;
  }
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
};
