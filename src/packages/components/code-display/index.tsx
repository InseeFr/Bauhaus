import { CodesList } from '../../model/CodesList';

type CodeDisplayTypes = {
	codesList: CodesList;
	value: string;
};

export const CodeDisplay = ({
	codesList,
	value,
}: Readonly<CodeDisplayTypes>) => {
	return <>{codesList?.codes?.find((t) => t.iri === value)?.labelLg1}</>;
};
