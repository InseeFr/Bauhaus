import loadGeneral from "./general";
import loadMembers from "./members";

const fetchClassification = (classificationId: string, levelId: string) => (dispatch: any) =>
  Promise.all([
    dispatch(loadGeneral(classificationId, levelId)),
    dispatch(loadMembers(classificationId, levelId)),
  ]);

export default fetchClassification;
