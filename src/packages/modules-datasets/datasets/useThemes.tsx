import { useQuery } from '@tanstack/react-query';
import { ThemesApi } from '../..//sdk';
import { Theme } from '../../model/Theme';
import { Options } from '../../model/SelectOption';

export const useThemes = () =>
	useQuery<Options>({
		queryKey: ['themes'],
		queryFn: () => {
			return ThemesApi.getThemes().then((themes: unknown) =>
				(themes as unknown as Theme[]).map((theme) => ({
					value: theme.uri,
					label: (
						<>
							{theme.label} <i>({theme.idConceptScheme})</i>
						</>
					),
				}))
			);
		},
	});
