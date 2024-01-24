import { useQuery } from "@tanstack/react-query";
import { CodesList } from "bauhaus-utilities";

export function useQueryCodesList(notation) {

    const { data } = useQuery({
		queryKey: ['codelist', notation],
		queryFn: () => {
            Promise.all([
                CodesList.getCodesList(notation),
                CodesList.getCodesListCodes(notation, 1, 0)
            ]).then(
                ([codesList, codes]) => [
                    codes.items ?? [],
                    ...codesList
                ]
            )
		}
	})

    return data
}
