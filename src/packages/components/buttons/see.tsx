import { createAllDictionary } from "../../utils/dictionnary";

const { D } = createAllDictionary({
  see: {
    fr: "Voir",
    en: "See",
  },
});

interface SeeButtonTypes {
  onClick: (e: any) => void;
}
export const SeeButton = (props: Readonly<SeeButtonTypes>) => {
  return (
    <button {...props} type="button" className="btn btn-default" aria-label={D.see} title={D.see}>
      <span className="glyphicon glyphicon-eye-open"></span>
    </button>
  );
};
