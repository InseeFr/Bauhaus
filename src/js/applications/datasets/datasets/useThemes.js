import { useQuery } from '@tanstack/react-query';
import api from '../../../remote-api/themes-api';

export const useThemes = () =>
	useQuery(['themes'], () => {
		return api.getThemes().then((themes) =>
			themes.map((theme) => ({
				value: theme.uri,
				label: (
					<>
						{theme.label} <i>({theme.idConceptScheme})</i>
					</>
				),
			}))
		);
	});
