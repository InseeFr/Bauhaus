import { useQuery } from '@tanstack/react-query';
import { ThemesApi } from '../../sdk';
import { Theme } from '../../model/theme';

export const useThemes = () =>
	useQuery({
		queryKey: ['themes'],
		queryFn: () => {
			return ThemesApi.getThemes().then((themes) =>
				(themes as Theme[]).map((theme) => ({
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
