import { useQuery } from '@tanstack/react-query';
import { ThemesApi } from '../../../new-architecture/sdk';

export const useThemes = () =>
	useQuery({
		queryKey: ['themes'],
		queryFn: () => {
			return ThemesApi.getThemes().then((themes) =>
				themes.map((theme) => ({
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
