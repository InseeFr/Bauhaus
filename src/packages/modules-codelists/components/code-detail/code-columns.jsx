import { D1, D2 } from "../../i18n/build-dictionary";

export const rowParams = [
  {
    dataField: "code",
    text: D1.codeTitle,
    width: "11%",
    classifiable: true,
    isKey: true,
  },
  {
    dataField: "labelLg1",
    text: D1.codeLabel,
    width: "16%",
    classifiable: true,
  },
  {
    dataField: "labelLg2",
    text: D2.codeLabel,
    width: "16%",
    classifiable: true,
  },
  {
    dataField: "broader",
    text: D1.codelistBroader,
    width: "30%",
    classifiable: false,
  },
  {
    dataField: "narrower",
    text: D1.codelistNarrower,
    width: "30%",
    classifiable: false,
  },
  {
    dataField: "closeMatch",
    text: D1.codelistCloseMatch,
    width: "30%",
    classifiable: false,
  },
  {
    dataField: "actions",
    text: "",
    width: "17%",
    classifiable: false,
  },
];
