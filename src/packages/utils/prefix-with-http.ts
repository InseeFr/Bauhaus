export const prefixWithHttp = (str: string) => {
  if (!str) return "";
  if (/^http(s?):\/\//.test(str)) return str;
  return `http://${str}`;
};
