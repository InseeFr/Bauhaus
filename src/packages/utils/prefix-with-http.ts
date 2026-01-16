export const prefixWithHttp = (str: string) =>
  str ? (/^http(s?):\/\//.test(str) ? str : `http://${str}`) : "";
